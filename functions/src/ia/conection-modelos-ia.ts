import {GoogleGenerativeAI} from "@google/generative-ai";
import {onCall, HttpsError} from "firebase-functions/v2/https";

// El API Key gratuito debe configurarse en Secrets de Firebase:
// firebase functions:secrets:set GEMINI_API_KEY
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// Se inyecta el modelo desde las variables de entorno, cayendo a flash por defecto.
const nombreModelo = process.env.GEMINI_MODEL_ID || "gemini-1.5-flash";

export const consultarAgenteSeguro = onCall({enforceAppCheck: true, region: "us-central1", secrets: ["GEMINI_API_KEY"]}, async (request) => {
  const {mensajeUsuario, instruccionSistema, historial = []} = request.data;

  if (!mensajeUsuario || !instruccionSistema) {
    throw new HttpsError("invalid-argument", "Datos incompletos.");
  }

  if (!apiKey) {
    throw new HttpsError("failed-precondition", "API Key de Developer no configurada.");
  }

  try {
    const modeloIA = genAI.getGenerativeModel({
      model: nombreModelo,
      systemInstruction: instruccionSistema,
      generationConfig: {maxOutputTokens: 800, temperature: 0.1},
    });

    const respuestaChat = modeloIA.startChat({history: historial});
    const resultado = await respuestaChat.sendMessage(mensajeUsuario);

    return {response: resultado.response.text()};
  } catch (error) {
    console.error("Error en IA Gratuita:", error);
    throw new HttpsError("internal", "Error en servicio IA gratuito.");
  }
});
