import * as admin from 'firebase-admin';

if (admin.apps.length === 0) admin.initializeApp();

// @ts-ignore
const cloudflareToken     = defineString('CLOUDFLARE_API_TOKEN');
// @ts-ignore
const cloudflareAccountId = defineString('CLOUDFLARE_ACCOUNT_ID');
// @ts-ignore
const apifyApiToken       = defineString('APIFY_API_TOKEN');
// @ts-ignore
const mapsApiKeyId        = defineString('GOOGLE_MAPS_KEY_ID');
// @ts-ignore
const cloudflareHubZoneId = defineString('CLOUDFLARE_HUB_ZONE_ID');



// ==========================================
// WOMPI
// ==========================================
// Webhook genérico para recibir negocios extraídos desde cualquier fuente
export { recibirNegociosExtraidos } from './webhooks/negocios-receiver';
// Webhook para procesar pagos y activaciones automáticas de Wompi
export { wompiWebhook } from './wompi/webhook';


// ==========================================
// ORQUESTACIÓN PARA MODELOS IA DEL PROYECTO FUTUROS USOS.
// ==========================================
//export * from "./ia/conection-modelos-ia";
//export * from "./ia/documentos/procesarDocumentoIa";
