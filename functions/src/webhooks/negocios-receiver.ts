import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

/**
 * Webhook genérico que recibe negocios extraídos (desde Apify u otro extractor)
 * y los persiste directamente en la colección pública `negocios` con verificado=false.
 * URL: https://us-central1-copaguia-53f7f.cloudfunctions.net/recibirNegociosExtraidos
 */
export const recibirNegociosExtraidos = onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const payload = req.body;
    const lugares = payload.data || [];

    if (!Array.isArray(lugares) || lugares.length === 0) {
      console.log('No se recibieron negocios en el payload.');
      res.status(200).send('No data to process');
      return;
    }

    const firestore  = admin.firestore();
    const negociosRef = firestore.collection('negocios');
    let processed = 0;
    let batch = firestore.batch();

    for (const lugar of lugares) {
      const nuevoNegocio = {
        titulo:     lugar.title          || 'Sin Nombre',
        telefono:   lugar.phone          || '',
        direccion:  lugar.address        || '',
        sitioWeb:   lugar.website        || '',
        categoria:  lugar.categoryName   || 'General',
        rating:     lugar.totalScore     || 0,
        reviews:    lugar.reviewsCount   || 0,
        latitud:    lugar.location?.lat  || null,
        longitud:   lugar.location?.lng  || null,
        fotos:      lugar.imageUrls      || [],

        // --- Campos del Directorio Vivo ---
        verificado:       false,
        creadoPorExtractor: true,
        fechaCreacion:    admin.firestore.FieldValue.serverTimestamp(),
        zonaAsignada:     payload.tenantId || 'desconocida',
        directorioId:     payload.tenantId || 'desconocido'
      };

      batch.set(negociosRef.doc(), nuevoNegocio);
      processed++;

      // Confirmar en bloques de 499 (límite de Firestore Batch)
      if (processed % 499 === 0) {
        await batch.commit();
        batch = firestore.batch();
      }
    }

    // Confirmar el último bloque parcial
    if (processed % 499 !== 0) await batch.commit();

    console.log(`✅ ${processed} negocios insertados en producción (verificado: false)`);

    // Actualizar estado del directorio a ACTIVO
    if (payload.tenantId) {
      await firestore.collection('Directorios').doc(payload.tenantId).update({
        estado: 'ACTIVO',
        negociosExtraidos: admin.firestore.FieldValue.increment(processed)
      });
    }

    res.status(200).send({ success: true, inserted: processed });
  } catch (error: any) {
    console.error('Error procesando negocios extraídos:', error);
    res.status(500).send({ error: 'Fallo procesando los datos.' });
  }
});
