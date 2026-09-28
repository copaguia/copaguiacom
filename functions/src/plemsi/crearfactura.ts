import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { createHash } from 'crypto';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  initializeApp();
}

const secretoEventosWompi = defineSecret('LIDER_SECRET_WOMPI_EVENTOS');
const tokenApiPlemsi     = defineSecret('LIDER_SECRET_PLEMSI_TOKEN');
const baseDatos          = getFirestore();

export const wompiWebhook = onRequest(
  {
    cors: false,
    secrets: [secretoEventosWompi, tokenApiPlemsi]
  },
  async (peticion, respuesta) => {
    try {
      const cuerpoLectura     = peticion.body;
      const firmaEntrante     = cuerpoLectura?.signature;
      const datosTransaccion  = cuerpoLectura?.data?.transaction;
      const evento            = cuerpoLectura?.event;
      const marcaTiempo       = cuerpoLectura?.timestamp;

      if (!firmaEntrante || !datosTransaccion) {
        respuesta.status(400).send('Payload incompleto');
        return;
      }

      // 1. Validar Checksum de eventos Wompi
      const secretoEventos   = secretoEventosWompi.value();
      const propiedades      = firmaEntrante.properties;
      let cadenaVerificacion = '';

      for (const prop of propiedades) {
        const valorPropiedad = prop.split('.').reduce((acc: any, key: string) => acc?.[key], cuerpoLectura.data);
        cadenaVerificacion  += valorPropiedad;
      }
      cadenaVerificacion += `\({marcaTiempo}\){secretoEventos}`;

      const checksumCalculado = createHash('sha256').update(cadenaVerificacion).digest('hex');

      if (checksumCalculado !== firmaEntrante.checksum) {
        respuesta.status(401).send('Checksum de Wompi inválido');
        return;
      }

      // 2. Procesar pago aprobado
      if (evento === 'transaction.updated' && datosTransaccion.status === 'APPROVED') {
        const referenciaPago = datosTransaccion.reference;
        const referenciaDoc  = baseDatos.collection('pedidos').doc(referenciaPago);
        const instantaneaDoc = await referenciaDoc.get();

        if (instantaneaDoc.exists && !instantaneaDoc.data()?.facturado) {
          // Marcar como aprobado para evitar duplicidad
          await referenciaDoc.set({ estado: 'PAGADO', transaccionId: datosTransaccion.id }, { merge: true });

          // 3. Ejecutar emisión de factura en Plemsi
          const tokenPlemsi = tokenApiPlemsi.value();
          
          // Llamada al endpoint de emisión de factura de Plemsi
          const respuestaPlemsi = await fetch('https://api.plemsi.com/v1/invoices', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${tokenPlemsi}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              referencia: referenciaPago,
              monto: datosTransaccion.amount_in_cents / 100,
              cliente: {
                email: datosTransaccion.customer_email,
                nombre: datosTransaccion.customer_data?.full_name || 'Consumidor Final',
                identificacion: datosTransaccion.customer_data?.legal_id || '222222222222'
              }
            })
          });

          if (respuestaPlemsi.ok) {
            const datosFactura = await respuestaPlemsi.json();
            await referenciaDoc.set({
              facturado: true,
              cufe: datosFactura.cufe,
              urlFacturaPdf: datosFactura.pdf_url
            }, { merge: true });
          }
        }
      }

      respuesta.status(200).json({ status: 'exito' });
      return;
    }
    catch (error) {
      respuesta.status(500).json({ error: 'Error procesando webhook y facturación' });
      return;
    }
  }
);





// fin del componente o servicio