import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';

export const wompiWebhook = onRequest(async (req, res) => {
  // Wompi sends events as POST
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const payload = req.body;
  const event = payload.event; // ej: "transaction.updated"
  const data = payload.data;
  const signature = payload.signature;
  const timestamp = payload.timestamp;

  // El secreto de eventos se usa para validar la integridad del Webhook
  const WOMPI_EVENTS_SECRET = process.env.WOMPI_EVENTS_SECRET || '';

  if (!signature || !signature.checksum) {
    res.status(400).send('Falta la firma digital (checksum).');
    return;
  }

  // Generar Checksum local
  try {
    let concatStr = '';
    // Wompi especifica el orden de las propiedades a concatenar en signature.properties
    for (const prop of signature.properties) {
      const parts = prop.split('.');
      let current: any = data;
      // Wompi pone properties como "transaction.id", pero data ya contiene "transaction"
      if (parts[0] === 'transaction') {
         current = data.transaction;
         if (parts[1]) current = current[parts[1]];
      }
      concatStr += current.toString();
    }
    
    concatStr += timestamp.toString();
    concatStr += WOMPI_EVENTS_SECRET;

    const localHash = crypto.createHash('sha256').update(concatStr).digest('hex');

    if (localHash !== signature.checksum) {
      console.error('ALERTA: Checksum inválido. Posible ataque o secreto incorrecto.', { localHash, provided: signature.checksum });
      res.status(403).send('Checksum inválido.');
      return;
    }
  } catch (err) {
    console.error('Error calculando checksum:', err);
    res.status(500).send('Error interno calculando firma.');
    return;
  }

  // Solo nos importan los pagos aprobados
  if (event === 'transaction.updated' && data.transaction.status === 'APPROVED') {
    const reference = data.transaction.reference; // Usamos la referencia como el ID del negocio + ID del usuario
    const amount = data.transaction.amount_in_cents;
    const paymentMethod = data.transaction.payment_method_type;
    
    // Parsear la referencia. Formato esperado: negocioId_uid_planPrecio
    const refParts = reference.split('_');
    if (refParts.length >= 2) {
      const negocioId = refParts[0];
      const uid = refParts[1];

      try {
        const db = admin.firestore();
        const negocioRef = db.collection('negocios').doc(negocioId);
        
        const docSnap = await negocioRef.get();
        if (docSnap.exists) {
          // Activar el negocio (Firma Digital confirmada por el pago)
          await negocioRef.update({
            verificado: true,
            duenoId: uid,
            fechaVerificacion: admin.firestore.FieldValue.serverTimestamp(),
            suscripcion: {
              estado: 'ACTIVA',
              metodoPago: paymentMethod,
              montoEnCentavos: amount,
              transaccionId: data.transaction.id,
              fechaInicio: admin.firestore.FieldValue.serverTimestamp(),
              // Por defecto, 1 año de suscripción
              fechaVencimiento: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            }
          });
          
          console.log(`Negocio ${negocioId} reclamado y activado por ${uid} via Wompi!`);
        } else {
          console.error(`Negocio ${negocioId} no existe, pero se recibió pago.`);
        }
      } catch (dbError) {
        console.error('Error actualizando negocio en base de datos:', dbError);
      }
    }
  }

  // Siempre responder 200 a Wompi para que no reintente
  res.status(200).send('OK');
});
