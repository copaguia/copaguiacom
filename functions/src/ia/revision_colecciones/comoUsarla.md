# 🚀 Guía de Uso: Motor Genérico de Auditoría

Este motor de configuración (*Config-Driven*) te permite programar revisiones automáticas mensuales sobre cualquier colección de tu base de datos de Firebase.

## ⚙️ ¿Cómo funciona?

Abre el archivo `revisor-mensual.ts` y modifica únicamente la constante `CONFIG_AUDITORIA`:

```typescript
const CONFIG_AUDITORIA = {
  coleccion: "usuarios",                   // Nombre exacto en Firestore
  soloActivos: true,                       // Si es true, buscará doc.activo == true
  emailAdmin: "tu@correo.com",             // Correo que recibe el resumen gerencial
  reglas: {
    camposObligatorios: ["telefono"],      // Novedad si el campo NO existe o está vacío
    camposVencimiento: ["suscripcionVence"], // Novedad si la fecha guardada es < a hoy
    diasAnticipacion: 5                    // Ejemplo: avisar 5 días antes de que venza
  }
};
```

## 📨 ¿Qué pasa después?
El día 1 de cada mes a las 08:00 AM (Bogotá):
1. El motor buscará todos los documentos que incumplan tus reglas.
2. Si el documento tiene un campo `email`, enviará un aviso automático genérico al usuario (vía Resend).
3. Escribirá en la colección `informesAuditoria` de Firestore un reporte del mes.
4. Enviará a `emailAdmin` un resumen HTML con la lista de usuarios/documentos que presentan novedades.

## 📝 Modificar los textos de los Correos
Si deseas cambiar el diseño o el texto de los correos automáticos, debes editar el archivo `servicios/resend.service.ts`. Allí viven las funciones `enviarCorreoAuditoriaGenerico` y `enviarInformeAuditoriaGenerico`.

## 🔐 Requisitos Previos
Debes tener el secreto de Resend guardado en Firebase:
```bash
firebase functions:secrets:set RESEND_API_KEY
```
