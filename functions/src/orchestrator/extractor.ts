import axios from 'axios';

export interface ExtractorConfig {
  apiKey: string;
}

export interface GeoPunto {
  lat: number;
  lng: number;
}

/**
 * Inicia una extracción de negocios reales desde Google Maps usando Apify.
 * Recibe los geopuntos del polígono del directorio y lanza el actor de extracción.
 * @param geoPuntos Array de coordenadas que delimitan la zona del directorio
 * @param config Configuración con la API Key del extractor
 * @returns El ID de la ejecución para rastrear el estado
 */
export async function iniciarExtraccionNegocios(geoPuntos: GeoPunto[], config: ExtractorConfig): Promise<string> {
  try {
    const runInput = {
      searchStringsArray: ["restaurantes", "tiendas", "servicios", "negocios"],
      customGeolocation: geoPuntos.map(p => ({ lat: p.lat, lng: p.lng })),
      maxCrawledPlacesPerSearch: 1000,
    };

    const actorId = 'compass~google-maps-extractor';
    const url = `https://api.apify.com/v2/acts/${actorId}/runs?token=${config.apiKey}`;

    const response = await axios.post(url, runInput, {
      headers: { 'Content-Type': 'application/json' }
    });

    return response.data.data.id;
  } catch (error: any) {
    console.error('Error iniciando extracción de negocios:', error.response?.data || error.message);
    throw new Error('Fallo al iniciar la extracción de negocios');
  }
}
