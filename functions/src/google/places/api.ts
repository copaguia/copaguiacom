import axios from 'axios';
import { COPACABANA_BOUNDS } from './config';

/**
 * Consulta la API de Google Places para encontrar negocios según un término de búsqueda.
 * Limitado a la primera página y a los campos básicos GRATUITOS.
 */
export async function searchPlacesForQuery(query: string, apiKey: string): Promise<any[]> {
  const url = 'https://places.googleapis.com/v1/places:searchText';

  const headers = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': apiKey,
    // Limitando estrictamente a campos gratuitos (Basic Data) para evitar costos
    'X-Goog-FieldMask': [
      'places.id',
      'places.displayName',
      'places.formattedAddress',
      'places.nationalPhoneNumber',
      'places.internationalPhoneNumber',
      'places.regularOpeningHours',
      'places.location',
      'places.types'
    ].join(','),
  };

  const data: any = {
    textQuery: query,
    languageCode: 'es',
    regionCode: 'co',
    locationRestriction: {
      rectangle: COPACABANA_BOUNDS,
    },
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data?.places || [];
  } catch (error: any) {
    console.error(`Error consultando Google Places para la búsqueda "${query}":`, error.response?.data || error.message);
    return [];
  }
}
