# Módulo de Documentos (IA)

Este directorio concentra la lógica central de análisis y extracción de documentos a través de Inteligencia Artificial (Google Gemini).

## Archivos Principales

- **`procesarDocumentoIa.ts`**: Es una Cloud Function (`onCall`) segura. Actúa como puente entre la aplicación (frontend) y la IA. Recibe imágenes en Base64, valida la sesión del usuario (AppCheck y Auth), selecciona el modelo de IA adecuado según la tarea y devuelve un objeto JSON estructurado listo para usarse. No interactúa con la base de datos.
- **`documentos.interface.ts`**: Define los contratos (interfaces) de TypeScript para las solicitudes de IA y las estrategias de prompting.

## Arquitectura de Inferencia (IA)

- **Conexión Única (`conection-modelos-ia.ts`)**: Para optimizar el rendimiento y evitar fugas de memoria, se utiliza una sola instancia compartida (singleton) del SDK de Google GenAI para todas las consultas.
- **Estrategias de Prompting (`estrategia-promts.ts`)**: Se utiliza una única constante centralizada que actúa como diccionario de intenciones. Aquí se especifica dinámicamente qué modelo (ej. flash-8b, pro, etc.) usar para cada documento, aplicando el principio de "No usar un elefante para matar una hormiga". Además, utiliza un formato de lenguaje robótico ultracompacto (`[JEO]v2`) para construir los prompts, lo que reduce drásticamente el consumo de tokens y los costos de la API.
