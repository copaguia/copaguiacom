import * as admin from 'firebase-admin';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onRequest } from 'firebase-functions/v2/https';
import { syncBusinesses } from './google/places/sync-businesses';
import { SYNC_CONFIG } from './google/places/config';

// Initialize Firebase Admin
if (admin.apps.length === 0) {
  admin.initializeApp();
}

/**
 * Función programada que se ejecuta diariamente a las 3:00 AM (hora de Colombia)
 */
export const sincronizarNegociosCopacabana = onSchedule(
  {
    schedule: SYNC_CONFIG.schedule,
    timeZone: SYNC_CONFIG.timeZone,
    secrets: ['PLACES_API_KEY'],
    timeoutSeconds: SYNC_CONFIG.timeoutSeconds,
    memory: SYNC_CONFIG.memory,
    invoker: 'private',
  },
  async (event) => {
    const apiKey = process.env.PLACES_API_KEY;
    if (!apiKey) {
      console.error('PLACES_API_KEY environment variable is not defined.');
      return;
    }

    console.log('Starting scheduled synchronization of Copacabana businesses from Google Places...');
    try {
      const summary = await syncBusinesses(apiKey);
      console.log(`Sync completed successfully: Added ${summary.added}, Updated ${summary.updated}, Deleted ${summary.deleted}, Total: ${summary.total}`);
    } catch (error: any) {
      console.error('Error during scheduled synchronization:', error);
    }
  }
);

// Endpoint temporal para probar la ejecución inmediatamente desde el navegador
export const testSync = onRequest(
  {
    secrets: ['PLACES_API_KEY'],
    memory: SYNC_CONFIG.memory,
    timeoutSeconds: SYNC_CONFIG.timeoutSeconds,
  },
  async (req, res) => {
    const apiKey = process.env.PLACES_API_KEY;
    if (!apiKey) {
      console.error('PLACES_API_KEY environment variable is not defined.');
      res.status(500).send('PLACES_API_KEY is missing');
      return;
    }

    console.log('Starting MANUAL synchronization of Copacabana businesses...');
    try {
      const summary = await syncBusinesses(apiKey);
      res.send(`Sincronización manual completada exitosamente. Se procesaron los negocios. Revisar Firestore. Detalles: Agregados ${summary.added}, Actualizados ${summary.updated}`);
    } catch (error: any) {
      console.error('Error during manual synchronization:', error);
      res.status(500).send('Ocurrió un error en la sincronización: ' + error.message);
    }
  }
);
