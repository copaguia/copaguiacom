import { onCall, HttpsError } from "firebase-functions/v2/https";
import { GoogleGenAI } from "@google/genai";
import { EXTRACTION_STRATEGIES } from "../estrategia-promts";
import { ExtractionRequest } from "./documentos.interface";

// Initialize the Gen AI SDK
const ai = new GoogleGenAI();

export const procesarDocumentoIa = onCall(
  {
    enforceAppCheck: true,
  },
  async (request) => {
    // 1. Validar autenticación
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "The function must be called while authenticated."
      );
    }

    const data = request.data as ExtractionRequest;

    const { tipo, imagenBase64, mimeType, usarPromptOptimizado } = data;

    // 2. Validar parámetros
    if (!tipo || !imagenBase64 || !mimeType) {
      throw new HttpsError(
        "invalid-argument",
        "Se requieren los parámetros: tipo, imagenBase64, mimeType"
      );
    }

    const strategy = EXTRACTION_STRATEGIES[tipo];
    if (!strategy) {
      throw new HttpsError(
        "invalid-argument",
        `Tipo de extracción no soportado: ${tipo}`
      );
    }

    // 3. Determinar qué prompt utilizar (optimizado por defecto)
    const systemInstruction = usarPromptOptimizado !== false
      ? strategy.promptOptimizado
      : strategy.promptHumano;

    try {
      const modeloAUsar = strategy.modeloDeseado || "gemini-2.5-flash";

      // 4. Invocar a Gemini
      const response = await ai.models.generateContent({
        model: modeloAUsar,
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  data: imagenBase64,
                  mimeType: mimeType,
                },
              },
              {
                text: "Extrae los datos de este documento.",
              },
            ],
          },
        ],
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: strategy.schema,
        },
      });

      const jsonText = response.text;
      if (!jsonText) {
        throw new Error("Respuesta vacía del modelo");
      }

      // 4. Retornar únicamente el payload JSON procesado
      return JSON.parse(jsonText);
    } catch (error) {
      console.error("Error al procesar documento con IA:", error);
      throw new HttpsError(
        "internal",
        "Error interno al procesar el documento."
      );
    }
  }
);
