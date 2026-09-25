# Módulo de Proveedores

Este directorio gestiona la lógica de negocio en segundo plano y automatizaciones relacionadas con la administración y cumplimiento de los proveedores.

## Archivos Principales

- **`auditor-mensual.ts`**: Es una Cloud Function programada (`onSchedule`) tipo cron job. Se ejecuta automáticamente el día 1 de cada mes. Revisa la base de datos de proveedores activos para detectar documentos legales faltantes o vencidos (Cámara de Comercio, INVIMA, etc.). Si encuentra irregularidades, envía automáticamente notificaciones por correo al proveedor usando la API de Resend y genera un informe en Firestore para la gerencia.
- **`proveedores.interface.ts`**: Define los tipos estrictos de TypeScript para la lectura y escritura de los perfiles de proveedores y sus estados de auditoría.

## Relación con la Arquitectura de IA

Cualquier futura implementación de análisis impulsado por IA para proveedores (ej. validar si un RUT subido es real) reutilizará la misma **conexión única global (`conection-modelos-ia.ts`)** y el diccionario de estrategias (`estrategia-promts.ts`), aplicando un enrutamiento inteligente de modelos para garantizar respuestas eficientes en costo mediante lenguaje compacto tipo JEO.
