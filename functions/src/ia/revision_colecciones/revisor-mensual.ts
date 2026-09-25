import { onSchedule } from "firebase-functions/v2/scheduler";
import { getFirestore } from "firebase-admin/firestore";
import { enviarCorreoAuditoriaGenerico, enviarInformeAuditoriaGenerico, resendApiKey } from "../../servicios/resend.service";

/**
 * ==========================================
 * ⚙️ CONFIGURACIÓN PARAMÉTRICA DEL AUDITOR
 * ==========================================
 * Cambia estos valores para adaptar el motor a cualquier colección.
 */
const CONFIG_AUDITORIA = {
  coleccion: "miColeccion",                // Nombre de la colección en Firestore
  soloActivos: true,                       // true = filtra por { activo: true }
  emailAdmin: "admin@tu-dominio.com",      // Email que recibe el resumen mensual
  reglas: {
    camposObligatorios: ["nombre"],          // Campos que NO pueden estar vacíos
    camposVencimiento: [],                   // Campos tipo Fecha que deben ser > hoy
    diasAnticipacion: 0                      // Avisar X días antes de que venza
  }
};

/**
 * Auditor Automático Mensual (Motor Config-Driven)
 */
export const auditorMensualGenerico = onSchedule({
  schedule: "0 8 1 * *",
  timeZone: "America/Bogota",
  maxInstances: 1,
  memory: "256MiB",
  secrets: [resendApiKey]
}, async (event) => {
  const db = getFirestore();
  const hoy = new Date();
  let correosEnviados = 0;
  let totalConNovedades = 0;
  const elementosConNovedad: any[] = [];

  console.log(`🚀 Iniciando Auditoría Mensual de [${CONFIG_AUDITORIA.coleccion}]...`);

  try {
    let query: any = db.collection(CONFIG_AUDITORIA.coleccion);
    if (CONFIG_AUDITORIA.soloActivos) {
      query = query.where("activo", "==", true);
    }
    const snapshot = await query.get();

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const novedades: string[] = [];

      // 1. Evaluar campos obligatorios
      CONFIG_AUDITORIA.reglas.camposObligatorios.forEach(campo => {
        if (!data[campo]) novedades.push(`Falta el campo: ${campo}`);
      });

      // 2. Evaluar fechas de vencimiento
      CONFIG_AUDITORIA.reglas.camposVencimiento.forEach(campoFecha => {
        const fecha = data[campoFecha]?.toDate();
        const limite = new Date();
        limite.setDate(limite.getDate() + CONFIG_AUDITORIA.reglas.diasAnticipacion);

        if (!fecha || fecha < limite) {
          novedades.push(`El documento '${campoFecha}' está vencido o próximo a vencer.`);
        }
      });

      // Si hay novedades, registrar y enviar correo
      if (novedades.length > 0) {
        totalConNovedades++;
        elementosConNovedad.push({
          id: doc.id,
          nombre: data.nombre || doc.id,
          email: data.email || null,
          novedades: novedades
        });

        if (data.email) {
          await enviarCorreoAuditoriaGenerico(data, novedades);
          
          await db.collection(CONFIG_AUDITORIA.coleccion).doc(doc.id).update({
            ultimaNotificacionAuditoria: hoy,
            estadoAuditoria: 'REQUIERE_ACCION'
          });

          correosEnviados++;
        }
      }
    }

    if (elementosConNovedad.length > 0) {
      console.log(`📊 Generando Informe Mensual para ${totalConNovedades} elementos...`);
      const informeRef = db.collection("informesAuditoria").doc();
      await informeRef.set({
        coleccionAuditada: CONFIG_AUDITORIA.coleccion,
        fechaCreacion: hoy,
        totalAnalizados: snapshot.size,
        totalConNovedades: totalConNovedades,
        detalles: elementosConNovedad
      });

      await enviarInformeAuditoriaGenerico(elementosConNovedad, snapshot.size, totalConNovedades, CONFIG_AUDITORIA.emailAdmin);
    }

    console.log(`✅ Auditoría finalizada. Correos enviados: ${correosEnviados}`);

  } catch (error) {
    console.error("❌ Error grave en auditoría:", error);
  }
});
