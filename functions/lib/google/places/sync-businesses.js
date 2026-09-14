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
exports.syncBusinesses = syncBusinesses;
const admin = __importStar(require("firebase-admin"));
const config_1 = require("./config");
const api_1 = require("./api");
// Placeholder URL predeterminado según solicitud del usuario
const PLACEHOLDER_IMAGE = 'https://firebasestorage.googleapis.com/v0/b/copaguia-77b5a.appspot.com/o/placeholders%2Fbusiness-placeholder.jpg?alt=media'; // Ajustar luego si tienen uno específico
function generateSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}
function mapGooglePlaceToNegocio(place, query) {
    const name = place.displayName?.text || 'Negocio sin nombre';
    const phone = place.nationalPhoneNumber || place.internationalPhoneNumber || '';
    let whatsappLink = '';
    if (phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        const waPhone = cleanPhone.startsWith('57') ? cleanPhone : `57${cleanPhone}`;
        whatsappLink = `https://wa.me/${waPhone}`;
    }
    const coordenadas = place.location
        ? `https://www.google.com/maps/search/?api=1&query=${place.location.latitude},${place.location.longitude}`
        : '';
    const slug = generateSlug(name);
    // Extraemos una categoría principal basada en el query de búsqueda
    const categoria = query;
    return {
        id: place.id,
        nombre: name,
        direccion: place.formattedAddress || 'Copacabana, Antioquia',
        telefono: phone,
        categoria: categoria,
        descripcion: `Negocio de ${categoria.toLowerCase()} ubicado en Copacabana.`,
        fechaCreacion: new Date().toISOString(),
        tags: ['Copacabana', categoria],
        imageFrontal: PLACEHOLDER_IMAGE,
        logoNegocio: PLACEHOLDER_IMAGE,
        whatsappLink: whatsappLink,
        slug: slug,
        seoTitle: `${name} - ${categoria} Copacabana`,
        seoDescription: `Encuentra información y servicios de ${name} en Copacabana. Teléfono: ${phone}.`,
        coordenadas: coordenadas,
        metodosPago: ['Efectivo'],
    };
}
async function syncBusinesses(apiKey) {
    const db = admin.firestore();
    db.settings({ ignoreUndefinedProperties: true });
    const allPlacesMap = new Map();
    // Iterar por cada palabra clave y buscar
    for (const query of config_1.PALABRAS_CLAVES) {
        const places = await (0, api_1.searchPlacesForQuery)(query, apiKey);
        for (const place of places) {
            if (place.id) {
                // Guardamos también el query para usarlo como categoría base
                place._matchedQuery = query;
                allPlacesMap.set(place.id, place);
            }
        }
    }
    const uniquePlaces = Array.from(allPlacesMap.values());
    // Filtrar estrictamente por los límites de Copacabana
    const filteredPlaces = uniquePlaces.filter(place => {
        if (!place.location?.latitude || !place.location?.longitude) {
            return false;
        }
        return (0, config_1.isInsideCopacabana)(place.location.latitude, place.location.longitude);
    });
    const businessesToSync = filteredPlaces.map(place => mapGooglePlaceToNegocio(place, place._matchedQuery));
    let addedCount = 0;
    let updatedCount = 0;
    const collectionRef = db.collection('negocios');
    for (const negocio of businessesToSync) {
        if (!negocio.id)
            continue;
        const docRef = collectionRef.doc(negocio.id);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
            // Usamos merge: true para no sobreescribir imágenes u otra info que el dueño haya actualizado manualmente
            await docRef.set(negocio, { merge: true });
            updatedCount++;
        }
        else {
            await docRef.set(negocio);
            addedCount++;
        }
    }
    return {
        added: addedCount,
        updated: updatedCount,
        deleted: 0,
        total: businessesToSync.length,
    };
}
//# sourceMappingURL=sync-businesses.js.map