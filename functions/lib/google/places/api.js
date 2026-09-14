"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchPlacesForQuery = searchPlacesForQuery;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("./config");
/**
 * Consulta la API de Google Places para encontrar negocios según un término de búsqueda.
 * Limitado a la primera página y a los campos básicos GRATUITOS.
 */
async function searchPlacesForQuery(query, apiKey) {
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
    const data = {
        textQuery: query,
        languageCode: 'es',
        regionCode: 'co',
        locationRestriction: {
            rectangle: config_1.COPACABANA_BOUNDS,
        },
    };
    try {
        const response = await axios_1.default.post(url, data, { headers });
        return response.data?.places || [];
    }
    catch (error) {
        console.error(`Error consultando Google Places para la búsqueda "${query}":`, error.response?.data || error.message);
        return [];
    }
}
//# sourceMappingURL=api.js.map