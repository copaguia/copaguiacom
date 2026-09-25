import { Resend } from 'resend';
import { defineSecret } from "firebase-functions/params";

export const resendApiKey = defineSecret('RESEND_API_KEY');

export const enviarCorreoAuditoriaGenerico = async (entidad: any, novedades: string[]) => {
  const resend = new Resend(resendApiKey.value());
  const listaHtml = novedades.map((n: string) => `<li>⚠️ <b>${n}</b></li>`).join("");

  return await resend.emails.send({
    from: 'Sistema de Auditoría <notificaciones@tu-dominio.com>',
    to: [entidad.email],
    subject: "🚨 [Acción Requerida] Actualización de Información",
    html: `
      <h2>Hola ${entidad.nombre},</h2>
      <p>Hemos detectado novedades en tu cuenta que requieren atención:</p>
      <ul>
        ${listaHtml}
      </ul>
      <p>Por favor, ingresa a la plataforma para regularizar esta situación.</p>
      <br>
      <p>Atentamente,<br><b>Equipo de Administración</b></p>
    `
  });
};

export const enviarInformeAuditoriaGenerico = async (elementos: any[], totalAnalizados: number, totalConNovedades: number, adminEmail: string) => {
  const resend = new Resend(resendApiKey.value());
  const listaAdminHtml = elementos.map((e: any) => `
    <li style="margin-bottom: 15px;">
      <strong>${e.nombre}</strong> (ID: ${e.id})<br>
      <span style="color: #d32f2f;">Novedades: ${e.novedades.join(', ')}</span>
    </li>
  `).join('');

  return await resend.emails.send({
    from: 'Auditoría Sistema <notificaciones@tu-dominio.com>',
    to: [adminEmail],
    subject: `📊 Informe Mensual de Auditoría`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #ff6d00;">Resumen de Auditoría</h2>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <ul style="margin: 0; padding-left: 20px;">
            <li>Registros analizados: <b>${totalAnalizados}</b></li>
            <li>Registros con novedades: <b>${totalConNovedades}</b></li>
          </ul>
        </div>
        <h3 style="border-bottom: 1px solid #ccc; padding-bottom: 5px;">Detalle de Novedades:</h3>
        <ul style="padding-left: 20px;">
          ${listaAdminHtml}
        </ul>
      </div>
    `
  });
};
