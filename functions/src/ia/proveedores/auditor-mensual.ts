import { onSchedule } from "firebase-functions/v2/scheduler";
import { getFirestore } from "firebase-admin/firestore";
import { Resend } from 'resend';
import { ProveedorFirestoreDataInterface, ProveedorIncompletoAuditoriaInterface } from "./proveedores.interface";

import { defineSecret } from "firebase-functions/params";
const resendApiKey = defineSecret('RESEND_API_KEY');

/**
 * Auditor Automático Mensual
 * Se ejecuta el día 1 de cada mes a las 08:00 AM (Zona horaria de Colombia).
 * Analiza todos los proveedores activos, detecta documentos vencidos/faltantes
 * y encola un correo electrónico para que el proveedor los actualice.
 */
export const auditorMensualProveedores = onSchedule({
  schedule: "0 8 1 * *",
  timeZone: "America/Bogota",
  maxInstances: 1,
  memory: "256MiB",
  secrets: [resendApiKey]
}, async (event) => {
  const db = getFirestore();
  const resend = new Resend(resendApiKey.value());
  const hoy = new Date();
  let correosEnviados = 0;

  const proveedoresIncompletos: ProveedorIncompletoAuditoriaInterface[] = [];
  let totalConFaltantes = 0;

  console.log("🚀 Iniciando Auditoría Mensual de Proveedores...");

  try {
    const proveedoresSnapshot = await db.collection("proveedores")
      .where("activo", "==", true)
      .get();

    for (const doc of proveedoresSnapshot.docs) {
      const proveedor = doc.data() as ProveedorFirestoreDataInterface;
      const faltantes: string[] = [];
      const compl = proveedor.cumplimiento || {};

      // Función auxiliar para revisar fecha
      const esInvalido = (fechaTimestamp: any) => {
        if (!fechaTimestamp) return true; // Null o Indefinido = Faltante
        const fechaVence = fechaTimestamp.toDate();
        return fechaVence < hoy; // Pasado = Vencido
      };

      // 1. Revisar Requisitos (Lógica Rápida y Gratuita, sin IA)
      if (esInvalido(compl.camaraComercioVence)) faltantes.push("Cámara de Comercio");
      if (esInvalido(compl.sanitarioVence)) faltantes.push("Concepto Sanitario (INVIMA)");
      if (esInvalido(compl.transporteVence)) faltantes.push("Certificado de Transporte de Alimentos");

      // NOTA: RUT y Ficha Técnica a veces no vencen, depende de tu regla de negocio
      if (!compl.rutUrl) faltantes.push("RUT (Copia Actualizada)");
      if (!compl.fichaUrl) faltantes.push("Ficha Técnica de Productos");

      // Si faltan documentos, agregamos al informe
      if (faltantes.length > 0) {
        totalConFaltantes++;
        proveedoresIncompletos.push({
          id: doc.id,
          nombre: proveedor.nombre || 'Desconocido',
          nit: proveedor.identificacionFiscal || 'N/A',
          email: proveedor.email || 'SIN CORREO',
          telefono: proveedor.telefono || 'SIN TELÉFONO',
          faltantes: faltantes
        });

        // 2. Enviar correo si el proveedor tiene email
        if (proveedor.email) {
          // Formatear lista HTML
        const listaHtml = faltantes.map(f => `<li>⚠️ <b>${f}</b></li>`).join("");

        // Aquí usamos la forma 100% NATIVA con el SDK de Resend, directo desde el código.
        await resend.emails.send({
          from: 'Administración Mega Sanduche <administracion@megasanduche.app>',
          to: [proveedor.email],
          subject: "🚨 [Acción Requerida] Actualización de Documentos INVIMA",
          html: `
            <h2>Hola Equipo de ${proveedor.nombre},</h2>
            <p>Esperamos que se encuentren muy bien.</p>
            <p>En Mega Sanduche estamos actualizando nuestros expedientes de calidad INVIMA. Hemos detectado que los siguientes documentos están vencidos o faltantes en su perfil corporativo:</p>
            <ul>
              ${listaHtml}
            </ul>
            <p>Por favor, ingrese al siguiente enlace único y seguro para subir sus PDFs actualizados:</p>
            <br>
            <a href="https://proveedores.megasanduche.com/upload?nit=${proveedor.identificacionFiscal}" style="background-color: #00e5ff; color: #121212; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Subir Documentos Ahora
            </a>
            <br><br>
            <p>Agradecemos su rápido compromiso con la inocuidad alimentaria.</p>
            <p>Atentamente,<br><b>Equipo de Calidad - Mega Sanduche</b></p>
          `
        });

        // Registrar acción de auditoría en el historial del proveedor
        await db.collection("proveedores").doc(doc.id).update({
          ultimaNotificacionAuditoria: hoy,
          estadoCumplimiento: 'CRITICO'
        });

        correosEnviados++;
      }
    }
    } // Cierre del for loop

    // ==========================================
    // 3. GENERAR INFORME MENSUAL PARA ADMINISTRACIÓN
    // ==========================================
    if (proveedoresIncompletos.length > 0) {
      console.log(`📊 Generando Informe Mensual para ${totalConFaltantes} proveedores con faltantes...`);
      
      // A) Guardar en Firestore
      const informeRef = db.collection("informesAuditoriaProveedores").doc();
      const datosInforme = {
        fechaCreacion: hoy,
        totalProveedoresAnalizados: proveedoresSnapshot.size,
        totalConFaltantes: totalConFaltantes,
        detalles: proveedoresIncompletos
      };
      await informeRef.set(datosInforme);

      // B) Enviar Correo a Administración
      const listaAdminHtml = proveedoresIncompletos.map(p => `
        <li style="margin-bottom: 15px;">
          <strong>${p.nombre}</strong> (NIT: ${p.nit})<br>
          <span style="color: #666;">Contacto: ${p.email} | Tel: ${p.telefono}</span><br>
          <span style="color: #d32f2f;">Faltan: ${p.faltantes.join(', ')}</span>
        </li>
      `).join('');

      await resend.emails.send({
        from: 'Auditoría Mega Sanduche <administracion@megasanduche.app>',
        to: ['megasanduchecopacabana@gmail.com'],
        subject: `📊 Informe Mensual de Auditoría INVIMA - Proveedores Pendientes`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #ff6d00;">Resumen de Auditoría de Proveedores</h2>
            <p>Se ha completado la revisión automática mensual de la carpeta de cumplimiento legal.</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
              <ul style="margin: 0; padding-left: 20px;">
                <li>Proveedores activos analizados: <b>${proveedoresSnapshot.size}</b></li>
                <li>Proveedores con documentos pendientes: <b>${totalConFaltantes}</b></li>
              </ul>
            </div>
            <h3 style="border-bottom: 1px solid #ccc; padding-bottom: 5px;">Detalle de Pendientes:</h3>
            <ul style="padding-left: 20px;">
              ${listaAdminHtml}
            </ul>
            <p style="background-color: #e3f2fd; padding: 12px; border-radius: 6px; font-size: 0.9em;">
              <strong>Nota:</strong> Se han enviado recordatorios automáticos a los proveedores que tienen un correo válido. 
              Por favor, contactar manualmente (vía WhatsApp o teléfono) a aquellos marcados como "SIN CORREO" 
              para actualizar su información y recolectar los documentos.
            </p>
          </div>
        `
      });
      
      console.log(`✅ Informe enviado a gerencia y guardado en Firestore ID: ${informeRef.id}`);
    } else {
      console.log(`✅ Auditoría perfecta: No hay proveedores con documentos faltantes.`);
    }

    console.log(`✅ Auditoría finalizada. Se enviaron ${correosEnviados} correos a proveedores.`);

  } catch (error) {
    console.error("❌ Error grave en auditoría masiva:", error);
  }
});
