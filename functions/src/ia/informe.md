# 🤖 LIDERTECH: Patrón Enterprise para Integración de IA (Gemini)

Este documento es la **Guía Maestra** de Lidertech para la implementación escalable, segura y económica de modelos de Inteligencia Artificial (Google Gemini) dentro del ecosistema de Firebase/Angular. 

Todo nuevo desarrollo que involucre IA debe seguir estrictamente este patrón.

---

## 🏗️ 1. Arquitectura Central (Separation of Concerns)

Para asegurar seguridad y mantenibilidad, la arquitectura divide las responsabilidades:

1. **Frontend (Angular)**: 
   - **No procesa IA.** Solo captura la información (cámara, subida de PDFs/imágenes) y orquesta la UI (Signals).
   - Delega la orden llamando a la Cloud Function segura (`procesarDocumentoIa`).
   - Se encarga de guardar (persistencia en Firestore) *después* de recibir la respuesta de la IA.
2. **Backend (Firebase Cloud Functions v2)**:
   - **Singleton de Conexión (`conection-modelos-ia.ts`)**: Se instancia el SDK (`@google/genai`) una sola vez en el entorno global de Node para evitar memory leaks y reducir latencia (Cold Starts).
   - **Validación Segura**: Se exige `AppCheck` (reCAPTCHA) y `request.auth` (Usuario Logueado). NUNCA dejar endpoints públicos de IA.
   - **Enrutador de Estrategias (`estrategia-promts.ts`)**: Aquí vive el "cerebro" y los diccionarios de instrucciones.

---

## 🧠 2. Cómo Agregar una Nueva Acción de IA

Si el día de mañana necesitas que la aplicación analice "Hojas de Vida" o "Menús de Restaurantes", **NO crees una Cloud Function nueva**. Solo debes actualizar el diccionario existente siguiendo estos pasos:

### Paso A: Crear la Estrategia
En el archivo `estrategia-promts.ts`, agrega una nueva llave a la constante `EXTRACTION_STRATEGIES`:

```typescript
hoja_de_vida: {
  modeloDeseado: "gemini-2.5-flash", // Selecciona el modelo según la complejidad
  promptOptimizado: `[JEO]v2
Out={candidato:{nombre,telefono,habilidades[]},apto:boolean}
[!]SoloJSON.NoMD`,
  promptHumano: `Extrae nombre, teléfono y habilidades del candidato.`,
  schema: { ... } // Define estrictamente el JSON Schema (Type.OBJECT)
}
```

### Paso B: Consumir en Angular
Desde cualquier servicio de Angular, llama al conector general usando la llave creada (`hoja_de_vida`):

```typescript
const response = await this.conectorService.ejecutarExtraccion({
  tipo: 'hoja_de_vida',
  imagenBase64: base64Data,
  mimeType: 'image/jpeg'
});
// La respuesta estará estrictamente tipada con tu schema.
```

---

## ⚖️ 3. Regla de Oro: "No usar un elefante para matar una hormiga" (Model Routing)

Para mantener los costos al mínimo absoluto, la propiedad `modeloDeseado` debe elegirse con cuidado. Consulta siempre la lista oficial de modelos para desarrolladores antes de asignar uno:

🔗 **[Catálogo Oficial de Modelos Gemini (Google AI Studio)](https://ai.google.dev/gemini-api/docs/models/gemini)**

### Guía de Selección Lidertech:
- **`gemini-1.5-flash-8b`**: (El más barato y rápido). Usar para tareas triviales de lectura corta, extracción de 2 o 3 datos exactos (ej. Gastos Hormiga, Tirillas simples).
- **`gemini-2.5-flash`**: (Balance Costo/Rendimiento). El "Caballo de Batalla". Usar por defecto para el 80% de las tareas de extracción de datos, OCR y análisis visual estándar.
- **`gemini-2.5-pro` / `gemini-1.5-pro`**: (Alta capacidad cognitiva). Usar ÚNICAMENTE para razonamiento complejo matemático, facturas extensas de múltiples páginas, validación estricta de sumatorias, o programación. Es más costoso.

---

## 📉 4. Optimización de Tokens (Protocolo JEO)

Para maximizar el uso del contexto y evitar pagar tokens innecesarios de entrada, todos los `promptOptimizado` deben estar redactados en formato pseudocódigo o lenguaje robótico compacto. 

**Ejemplo de Patrón Lidertech JEO:**
```text
[JEO]v2
Out={datoA,datoB}
[LOGIC]
IF(condicion) { haz esto } ELSE { haz esto otro }
[!]SoloJSON.NoMD.NulosSiVacio
```

## ✅ Checklist de Mantenimiento Anual
- [ ] Revisar el **[Catálogo Oficial de Gemini](https://ai.google.dev/gemini-api/docs/models/gemini)** para verificar si hay versiones más rápidas/baratas.
- [ ] Actualizar el paquete `@google/genai` en el `package.json` de Functions.
- [ ] Validar que los Prompts Humanos y Optimizados sigan retornando el mismo nivel de exactitud.
