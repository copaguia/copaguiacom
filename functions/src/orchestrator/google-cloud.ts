import { google } from 'googleapis';

/**
 * Autentica y obtiene un cliente autorizado usando Default Application Credentials.
 * En Firebase Functions, esto usa la cuenta de servicio por defecto.
 */
async function getAuthClient() {
  const auth = new google.auth.GoogleAuth({
    scopes: [
      'https://www.googleapis.com/auth/cloud-platform',
      'https://www.googleapis.com/auth/firebase'
    ]
  });
  return await auth.getClient();
}

/**
 * Añade un nuevo dominio a la lista de Dominios Autorizados en Firebase Auth.
 * @param projectId El ID del proyecto (ej. copaguia-53f7f)
 * @param newDomain El nuevo dominio (ej. guianiquia.com)
 */
export async function addAuthorizedDomainAuth(projectId: string, newDomain: string) {
  try {
    const authClient = await getAuthClient();
    const identityToolkit = google.identitytoolkit({ version: 'v2', auth: authClient as any });

    // 1. Obtener la configuración actual
    const configPath = `projects/${projectId}/config`;
    const currentConfig = await identityToolkit.projects.getConfig({ name: configPath });
    
    let authorizedDomains = currentConfig.data.authorizedDomains || [];
    
    // 2. Si el dominio no está, agregarlo
    if (!authorizedDomains.includes(newDomain)) {
      authorizedDomains.push(newDomain);
      
      // 3. Actualizar la configuración
      await identityToolkit.projects.updateConfig({
        name: configPath,
        updateMask: 'authorizedDomains',
        requestBody: {
          authorizedDomains: authorizedDomains
        }
      });
      console.log(`Dominio ${newDomain} añadido exitosamente a Firebase Auth.`);
    } else {
      console.log(`El dominio ${newDomain} ya estaba autorizado en Firebase Auth.`);
    }
  } catch (error: any) {
    console.error('Error actualizando Firebase Auth domains:', error.message);
    throw new Error('Fallo al actualizar Firebase Auth');
  }
}

/**
 * Agrega un nuevo dominio a las restricciones de una Clave API de Google Maps.
 * @param projectId El ID del proyecto
 * @param keyId El identificador de la llave (se puede ver en GCP URL o usando la API de listar llaves)
 * @param newDomain El nuevo dominio (ej. guianiquia.com)
 */
export async function updateMapsKeyRestrictions(projectId: string, keyId: string, newDomain: string) {
  try {
    const authClient = await getAuthClient();
    const apikeys = google.apikeys({ version: 'v2', auth: authClient as any });

    const keyName = `projects/${projectId}/locations/global/keys/${keyId}`;
    
    // 1. Obtener la llave actual
    const currentKey = await apikeys.projects.locations.keys.get({ name: keyName });
    
    const restrictions = currentKey.data.restrictions || {};
    const browserRestrictions = restrictions.browserKeyRestrictions || { allowedReferrers: [] };
    const allowedReferrers = browserRestrictions.allowedReferrers || [];

    const referrerString = `https://*.${newDomain}/*`;

    // 2. Añadir si no existe
    if (!allowedReferrers.includes(referrerString)) {
      allowedReferrers.push(referrerString);
      
      // 3. Actualizar la llave
      await apikeys.projects.locations.keys.patch({
        name: keyName,
        updateMask: 'restrictions.browserKeyRestrictions.allowedReferrers',
        requestBody: {
          restrictions: {
            ...restrictions,
            browserKeyRestrictions: {
              allowedReferrers: allowedReferrers
            }
          }
        }
      });
      console.log(`Referenciador ${referrerString} añadido a la API Key de Maps.`);
    } else {
      console.log(`El referenciador ${referrerString} ya existía en la API Key.`);
    }
  } catch (error: any) {
    console.error('Error actualizando API Key restrictions:', error.message);
    throw new Error('Fallo al actualizar API Key');
  }
}
