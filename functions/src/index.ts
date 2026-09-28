import * as admin from 'firebase-admin';
if (admin.apps.length === 0) admin.initializeApp();




// ============================================================================
// WEBHOOKS Y RECEPTORES EXTERNOS
// ============================================================================
export { recibirNegociosExtraidos } from './webhooks/negocios-receiver';
export { wompiWebhook }             from './wompi/webhook';





// ============================================================================
// AUTENTICACIÓN Y SEGURIDAD MULTITENANT - intercambia entre dominios de cloudflare conectados y comprados.
// ============================================================================
export { generarTokenSSO }          from './firebase/tokenSSOAuthIntercambioDominios';






// ============================================================================
// CREACIÓN Y PROVISIÓN DE DIRECTORIOS - orquesta la creacion del nuevo disrectorio.
// ============================================================================
export { provisionarNuevoDirectorio } from './cloudflare/constructorDirectorioNuevos';



// ============================================================================
// MODELOS IA (RESERVADOS PARA USOS FUTUROS)
// ============================================================================
// export * from './ia/conection-modelos-ia';
// export * from './ia/documentos/procesarDocumentoIa';