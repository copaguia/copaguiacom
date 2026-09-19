import * as admin from 'firebase-admin';

if (admin.apps.length === 0) admin.initializeApp();

import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineString }       from 'firebase-functions/params';
import { comprarDominio, conectarDominioExistente, listarDominiosRegistrados } from './cloudflare/cloudflareDomains';
import { addAuthorizedDomainAuth, updateMapsKeyRestrictions } from './orchestrator/google-cloud';
import { iniciarExtraccionNegocios } from './orchestrator/extractor';

// @ts-ignore
const cloudflareToken     = defineString('CLOUDFLARE_API_TOKEN');
// @ts-ignore
const cloudflareAccountId = defineString('CLOUDFLARE_ACCOUNT_ID');
// @ts-ignore
const apifyApiToken       = defineString('APIFY_API_TOKEN');
// @ts-ignore
const mapsApiKeyId        = defineString('GOOGLE_MAPS_KEY_ID');

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
    } else {
      await conectarDominioExistente(dominioObjetivo, cfConfig);
      console.log(`✅ Dominio existente conectado: ${dominioObjetivo}`);
    }

    // 2. Google Cloud: Añadir a Firebase Auth
    await addAuthorizedDomainAuth(projectId, dominioObjetivo);
    console.log(`✅ Auth autorizado para ${dominioObjetivo}`);

    // 3. Google Cloud: Proteger API Key de Maps
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
