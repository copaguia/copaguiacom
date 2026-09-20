"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarTokenSSO = exports.checkDomainAvailability = exports.listarDominiosCloudflare = exports.recibirNegociosExtraidos = exports.provisionarNuevoDirectorio = void 0;
const admin = __importStar(require("firebase-admin"));
if (admin.apps.length === 0)
    admin.initializeApp();
const https_1 = require("firebase-functions/v2/https");
const params_1 = require("firebase-functions/params");
const cloudflareDomains_1 = require("./cloudflare/cloudflareDomains");
const google_cloud_1 = require("./orchestrator/google-cloud");
const extractor_1 = require("./orchestrator/extractor");
// @ts-ignore
const cloudflareToken = (0, params_1.defineString)('CLOUDFLARE_API_TOKEN');
// @ts-ignore
const cloudflareAccountId = (0, params_1.defineString)('CLOUDFLARE_ACCOUNT_ID');
// @ts-ignore
const apifyApiToken = (0, params_1.defineString)('APIFY_API_TOKEN');
// @ts-ignore
const mapsApiKeyId = (0, params_1.defineString)('GOOGLE_MAPS_KEY_ID');
// @ts-ignore
const cloudflareHubZoneId = (0, params_1.defineString)('CLOUDFLARE_HUB_ZONE_ID');
/**
 * Orquestador principal Zero-Touch.
 * Soporta dos modos:
 *   - modoConexion: 'NUEVO'     → Compra el dominio en Cloudflare y configura DNS.
 *   - modoConexion: 'EXISTENTE' → Conecta un dominio ya comprado (ej. niquia.com).
 */
exports.provisionarNuevoDirectorio = (0, https_1.onCall)(async (request) => {
    const data = request.data;
    if (!data.nombreDirectorio || !data.dominioObjetivo || !data.limitePoligonal) {
        throw new https_1.HttpsError('invalid-argument', 'Faltan: nombreDirectorio, dominioObjetivo, limitePoligonal');
    }
    const { nombreDirectorio, dominioObjetivo, limitePoligonal } = data;
    const modoConexion = data.modoConexion ?? 'EXISTENTE'; // 'NUEVO' | 'EXISTENTE'
    const projectId = process.env.GCLOUD_PROJECT || 'copaguia-53f7f';
    try {
        console.log(`Iniciando orquestación [${modoConexion}] para: ${dominioObjetivo}`);
        // 1. Cloudflare: Comprar o Conectar dominio según el modo
        const cfConfig = {
            accountId: cloudflareAccountId.value(),
            apiToken: cloudflareToken.value()
        };
        if (modoConexion === 'NUEVO') {
            await (0, cloudflareDomains_1.comprarDominio)(dominioObjetivo, cfConfig);
            await (0, cloudflareDomains_1.conectarDominioExistente)(dominioObjetivo, cfConfig);
            console.log(`✅ Dominio comprado y DNS configurado: ${dominioObjetivo}`);
        }
        else {
            await (0, cloudflareDomains_1.conectarDominioExistente)(dominioObjetivo, cfConfig);
            console.log(`✅ Dominio existente conectado: ${dominioObjetivo}`);
        }
        // 2. Cloudflare: Crear Custom Hostname en la Zona Hub
        await (0, cloudflareDomains_1.crearCustomHostname)(dominioObjetivo, cloudflareHubZoneId.value(), cfConfig);
        console.log(`✅ Custom Hostname creado en la zona Hub para ${dominioObjetivo}`);
        // 3. Google Cloud: Proteger API Key de Maps (Se mantiene por requerimiento)
        await (0, google_cloud_1.updateMapsKeyRestrictions)(projectId, mapsApiKeyId.value(), dominioObjetivo);
        console.log(`✅ Maps API Key protegida para ${dominioObjetivo}`);
        // 4. Extracción de negocios: Lanzar sobre el polígono del directorio
        const extractorConfig = { apiKey: apifyApiToken.value() };
        const jobId = await (0, extractor_1.iniciarExtraccionNegocios)(limitePoligonal, extractorConfig);
        console.log(`✅ Extracción iniciada con ID: ${jobId}`);
        // 5. Guardar el directorio en Firestore con estado inicial
        const directorioRef = admin.firestore().collection('Directorios').doc();
        await directorioRef.set({
            nombre: nombreDirectorio,
            dominio: dominioObjetivo,
            modoConexion: modoConexion,
            limitePoligonal: limitePoligonal,
            estado: 'PROVISIONANDO',
            extractorJobId: jobId,
            fechaCreacion: admin.firestore.FieldValue.serverTimestamp()
        });
        return {
            success: true,
            directorioId: directorioRef.id,
            mensaje: `Directorio ${dominioObjetivo} en aprovisionamiento. Modo: ${modoConexion}.`
        };
    }
    catch (error) {
        console.error('Error en orquestador:', error);
        throw new https_1.HttpsError('internal', `Fallo en el aprovisionamiento: ${error.message}`);
    }
});
// Webhook genérico para recibir negocios extraídos desde cualquier fuente
var negocios_receiver_1 = require("./webhooks/negocios-receiver");
Object.defineProperty(exports, "recibirNegociosExtraidos", { enumerable: true, get: function () { return negocios_receiver_1.recibirNegociosExtraidos; } });
/**
 * Retorna la lista de dominios registrados en la cuenta Cloudflare del Dev.
 * Usado por el Dev Dashboard para mostrar un selector de dominios disponibles.
 */
exports.listarDominiosCloudflare = (0, https_1.onCall)(async () => {
    try {
        const cfConfig = {
            accountId: cloudflareAccountId.value(),
            apiToken: cloudflareToken.value()
        };
        const dominios = await (0, cloudflareDomains_1.listarDominiosRegistrados)(cfConfig);
        return { success: true, dominios };
    }
    catch (error) {
        console.error('Error listando dominios:', error);
        throw new https_1.HttpsError('internal', `No se pudo obtener la lista de dominios: ${error.message}`);
    }
});
/**
 * Verifica disponibilidad de un dominio en Cloudflare.
 */
exports.checkDomainAvailability = (0, https_1.onCall)(async (request) => {
    const { dominio } = request.data;
    if (!dominio)
        throw new https_1.HttpsError('invalid-argument', 'Falta el dominio');
    try {
        const cfConfig = {
            accountId: cloudflareAccountId.value(),
            apiToken: cloudflareToken.value()
        };
        const resultado = await (0, cloudflareDomains_1.verificarDisponibilidadDominio)(dominio, cfConfig);
        return { success: true, ...resultado };
    }
    catch (error) {
        console.error('Error verificando dominio:', error);
        throw new https_1.HttpsError('internal', `No se pudo verificar el dominio: ${error.message}`);
    }
});
/**
 * SSO Auth Hub: Emite Custom Token si el dominio de retorno es válido.
 */
exports.generarTokenSSO = (0, https_1.onCall)(async (request) => {
    const { uid, dominioRetorno } = request.data;
    if (!uid || !dominioRetorno)
        throw new https_1.HttpsError('invalid-argument', 'Faltan uid o dominioRetorno');
    try {
        // Verificar si el dominioRetorno está registrado
        const domainQuery = await admin.firestore().collection('Directorios').where('dominio', '==', dominioRetorno).get();
        // Si no está registrado y no es localhost, bloquear
        if (domainQuery.empty && !dominioRetorno.includes('localhost')) {
            throw new https_1.HttpsError('permission-denied', 'Dominio de retorno no autorizado');
        }
        const customToken = await admin.auth().createCustomToken(uid);
        return { success: true, token: customToken };
    }
    catch (error) {
        console.error('Error generando token SSO:', error);
        throw new https_1.HttpsError('internal', `Fallo al generar Token SSO: ${error.message}`);
    }
});
//# sourceMappingURL=index.js.map