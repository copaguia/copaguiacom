import { onCall, HttpsError }        from 'firebase-functions/v2/https';
import { defineString }               from 'firebase-functions/params';
import * as admin                     from 'firebase-admin';
import { dispararExtractorApify }     from '../apify/coneccionExtraccionApify';

const cloudflareToken   = defineString('CLOUDFLARE_API_TOKEN');
const cloudflareAccount = defineString('CLOUDFLARE_ACCOUNT_ID');
const apifyToken        = defineString('APIFY_API_TOKEN');

export interface DatosProvisionarDirectorio {
  nombreMunicipio:  string;
  dominioSolicitado: string;
  terminoBusqueda?:  string;
  limiteLugares?:    number;
}

export const provisionarNuevoDirectorio = onCall(async (solicitud) => {
  const { data, auth } = solicitud;

  if (!auth) {
    throw new HttpsError('unauthenticated', 'Operación restringida a administradores.');
  }

  const { nombreMunicipio, dominioSolicitado, terminoBusqueda, limiteLugares } = data as DatosProvisionarDirectorio;

  if (!nombreMunicipio || !dominioSolicitado) {
    throw new HttpsError('invalid-argument', 'El nombre del municipio y dominio son obligatorios.');
  }

  const idDirectorio = dominioSolicitado.toLowerCase().trim().replace(/[^a-z0-9]/g, '-');
  const firestore    = admin.firestore();
  const directorioRef = firestore.collection('Directorios').doc(idDirectorio);

  try {
    const registroDirectorio = {
      idDirectorio:       idDirectorio,
      nombre:             nombreMunicipio,
      dominio:            dominioSolicitado,
      estado:             'EN_CONFIGURACION',
      negociosExtraidos:  0,
      fechaCreacion:      admin.firestore.FieldValue.serverTimestamp(),
      creadoPor:          auth.uid
    };

    await directorioRef.set(registroDirectorio, { merge: true });

    let tareaApify: { idEjecucion: string; idDataset: string } | null = null;

    if (terminoBusqueda) {
      const urlWebhookBase = `https://${solicitud.rawRequest.headers.host}/recibirNegociosExtraidos`;

      tareaApify = await dispararExtractorApify(
        {
          terminosBusqueda: [terminoBusqueda],
          ubicacionTexto:   nombreMunicipio,
          limiteResultados: limiteLugares || 200,
          tenantId:         idDirectorio,
          webhookUrl:       urlWebhookBase
        },
        apifyToken.value()
      );

      await directorioRef.update({
        idEjecucionApify: tareaApify.idEjecucion,
        idDatasetApify:   tareaApify.idDataset,
        estado:           'EXTRAYENDO'
      });
    }

    return {
      exito:        true,
      idDirectorio: idDirectorio,
      mensaje:      'Directorio aprovisionado con éxito.',
      apifyJob:     tareaApify?.idEjecucion || null
    };
  } catch (error: any) {
    console.error('Error en orquestador de provisión:', error);
    throw new HttpsError('internal', `Fallo al aprovisionar el directorio: ${error.message}`);
  }
});