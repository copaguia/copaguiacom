import * as admin             from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

/**
 * VALIDADOR Y PUENTE DE SESIÓN CROSS-DOMAIN (SSO)
 * 
 * Propósito:
 * Por seguridad del navegador (Same-Origin Policy), las cookies y el almacenamiento local
 * de Firebase Auth no se comparten entre dominios distintos (ej. de directoriopaisa.com a niquia.com).
 * 
 * Flujo de ejecución:
 * 1. El usuario inicia sesión en el hub central.
 * 2. Al saltar a un tenant, Angular (auth-hub) envía el UID del usuario y el dominio de destino.
 * 3. Esta función valida en Firestore que el dominio de retorno pertenezca a la red de 'Directorios' autorizados.
 * 4. Si el dominio es legítimo, emite un Custom Token firmado por Firebase Admin.
 * 5. El dominio destino recibe ese token y ejecuta signInWithCustomToken(), manteniendo la misma sesión activa
 *    sin exigir usuario y contraseña nuevamente.
 */
export const generarTokenSSO = onCall(async (peticion) => {
  const { uid, dominioRetorno } = peticion.data;
  if (!uid || !dominioRetorno) throw new HttpsError('invalid-argument', 'Faltan uid o dominioRetorno');

  try {
    const consultaDominio = await admin.firestore().collection('Directorios').where('dominio', '==', dominioRetorno).get();

    if (consultaDominio.empty && !dominioRetorno.includes('localhost')) {
      throw new HttpsError('permission-denied', 'Dominio de retorno no autorizado');
    }

    const tokenPersonalizado = await admin.auth().createCustomToken(uid);
    return { success: true, token: tokenPersonalizado };
  } catch (error: any) {
    console.error('Error generando token de intercambio SSO:', error);
    throw new HttpsError('internal', `Fallo al generar Token SSO: ${error.message}`);
  }
});