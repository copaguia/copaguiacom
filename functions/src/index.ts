import * as admin from 'firebase-admin';

if (admin.apps.length === 0) admin.initializeApp();

import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineString }       from 'firebase-functions/params';
import { comprarDominio, conectarDominioExistente, listarDominiosRegistrados, verificarDisponibilidadDominio, crearCustomHostname, crearSubdominio } from './cloudflare/cloudflareDomains';
import { updateMapsKeyRestrictions } from './orchestrator/google-cloud';
import { iniciarExtraccionNegocios } from './orchestrator/extractor';

// @ts-ignore
const cloudflareToken     = defineString('CLOUDFLARE_API_TOKEN');
// @ts-ignore
const cloudflareAccountId = defineString('CLOUDFLARE_ACCOUNT_ID');
// @ts-ignore
const apifyApiToken       = defineString('APIFY_API_TOKEN');
// @ts-ignore
const mapsApiKeyId        = defineString('GOOGLE_MAPS_KEY_ID');
// @ts-ignore
const cloudflareHubZoneId = defineString('CLOUDFLARE_HUB_ZONE_ID');

/**
 * Orquestador principal Zero-Touch.
 * Soporta dos modos:
 *   - modoConexion: 'NUEVO'     → Compra el dominio en Cloudflare y configura DNS.
 *   - modoConexion: 'EXISTENTE' → Conecta un dominio ya comprado (ej. niquia.com).
 */
export const provisionarNuevoDirectorio = onCall(async (request) => {
  const data = request.data;

  if (!data.nombreDirectorio || !data.dominioObjetivo || !data.limitePoligonal) {
    throw new HttpsError('invalid-argument', 'Faltan: nombreDirectorio, dominioObjetivo, limitePoligonal');
  }

  const { nombreDirectorio, dominioObjetivo, limitePoligonal } = data;
  const modoConexion = data.modoConexion ?? 'EXISTENTE'; // 'NUEVO' | 'EXISTENTE'
  const projectId    = process.env.GCLOUD_PROJECT || 'copaguia-53f7f';

  try {
    console.log(`Iniciando orquestación [${modoConexion}] para: ${dominioObjetivo}`);

    // 1. Cloudflare: Comprar o Conectar dominio según el modo
    const cfConfig = {
      accountId: cloudflareAccountId.value(),
      apiToken:  cloudflareToken.value()
    };

    if (modoConexion === 'NUEVO') {
      await comprarDominio(dominioObjetivo, cfConfig);
      await conectarDominioExistente(dominioObjetivo, cfConfig);
      console.log(`✅ Dominio comprado y DNS configurado: ${dominioObjetivo}`);
      await crearCustomHostname(dominioObjetivo, cloudflareHubZoneId.value(), cfConfig);
      console.log(`✅ Custom Hostname creado en la zona Hub para ${dominioObjetivo}`);
    } else if (modoConexion === 'SUBDOMINIO') {
      await crearSubdominio(dominioObjetivo, cloudflareHubZoneId.value(), cfConfig);
      console.log(`✅ Subdominio configurado exitosamente: ${dominioObjetivo}`);
      // Para subdominios bajo la misma zona no es necesario Custom Hostname
    } else {
      await conectarDominioExistente(dominioObjetivo, cfConfig);
      console.log(`✅ Dominio existente conectado: ${dominioObjetivo}`);
      await crearCustomHostname(dominioObjetivo, cloudflareHubZoneId.value(), cfConfig);
      console.log(`✅ Custom Hostname creado en la zona Hub para ${dominioObjetivo}`);
    }

    // 3. Google Cloud: Proteger API Key de Maps (Se mantiene por requerimiento)
    await updateMapsKeyRestrictions(projectId, mapsApiKeyId.value(), dominioObjetivo);
    console.log(`✅ Maps API Key protegida para ${dominioObjetivo}`);

    // 4. Extracción de negocios: Lanzar sobre el polígono del directorio
    const extractorConfig = { apiKey: apifyApiToken.value() };
    const jobId = await iniciarExtraccionNegocios(limitePoligonal, extractorConfig);
    console.log(`✅ Extracción iniciada con ID: ${jobId}`);

    // 5. Guardar el directorio en Firestore con estado inicial
    const directorioRef = admin.firestore().collection('Directorios').doc();
    await directorioRef.set({
      nombre:          nombreDirectorio,
      dominio:         dominioObjetivo,
      modoConexion:    modoConexion,
      limitePoligonal: limitePoligonal,
      estado:          'PROVISIONANDO',
      extractorJobId:  jobId,
      fechaCreacion:   admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      success:     true,
      directorioId: directorioRef.id,
      mensaje:     `Directorio ${dominioObjetivo} en aprovisionamiento. Modo: ${modoConexion}.`
    };

  } catch (error: any) {
    console.error('Error en orquestador:', error);
    throw new HttpsError('internal', `Fallo en el aprovisionamiento: ${error.message}`);
  }
});

// Webhook genérico para recibir negocios extraídos desde cualquier fuente
export { recibirNegociosExtraidos } from './webhooks/negocios-receiver';

// Webhook para procesar pagos y activaciones automáticas de Wompi
export { wompiWebhook } from './wompi/webhook';

/**
 * Retorna la lista de dominios registrados en la cuenta Cloudflare del Dev.
 * Usado por el Dev Dashboard para mostrar un selector de dominios disponibles.
 */
export const listarDominiosCloudflare = onCall(async () => {
  try {
    const cfConfig = {
      accountId: cloudflareAccountId.value(),
      apiToken:  cloudflareToken.value()
    };
    const dominios = await listarDominiosRegistrados(cfConfig);
    return { success: true, dominios };
  } catch (error: any) {
    console.error('Error listando dominios:', error);
    throw new HttpsError('internal', `No se pudo obtener la lista de dominios: ${error.message}`);
  }
});

/**
 * Verifica disponibilidad de un dominio en Cloudflare.
 */
export const checkDomainAvailability = onCall(async (request) => {
  const { dominio } = request.data;
  if (!dominio) throw new HttpsError('invalid-argument', 'Falta el dominio');

  try {
    const cfConfig = {
      accountId: cloudflareAccountId.value(),
      apiToken:  cloudflareToken.value()
    };
    const resultado = await verificarDisponibilidadDominio(dominio, cfConfig);
    return { success: true, ...resultado };
  } catch (error: any) {
    console.error('Error verificando dominio:', error);
    throw new HttpsError('internal', `No se pudo verificar el dominio: ${error.message}`);
  }
});

/**
 * SSO Auth Hub: Emite Custom Token si el dominio de retorno es válido.
 */
export const generarTokenSSO = onCall(async (request) => {
  const { uid, dominioRetorno } = request.data;
  if (!uid || !dominioRetorno) throw new HttpsError('invalid-argument', 'Faltan uid o dominioRetorno');

  try {
    // Verificar si el dominioRetorno está registrado
    const domainQuery = await admin.firestore().collection('Directorios').where('dominio', '==', dominioRetorno).get();
    
    // Si no está registrado y no es localhost, bloquear
    if (domainQuery.empty && !dominioRetorno.includes('localhost')) {
      throw new HttpsError('permission-denied', 'Dominio de retorno no autorizado');
    }

    const customToken = await admin.auth().createCustomToken(uid);
    return { success: true, token: customToken };
  } catch (error: any) {
    console.error('Error generando token SSO:', error);
    throw new HttpsError('internal', `Fallo al generar Token SSO: ${error.message}`);
  }
});
