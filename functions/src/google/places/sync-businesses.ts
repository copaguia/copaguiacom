import * as admin from 'firebase-admin';
import { PALABRAS_CLAVES, isInsideCopacabana } from './config';
import { searchPlacesForQuery } from './api';

// Placeholder URL predeterminado según solicitud del usuario
const PLACEHOLDER_IMAGE = 'https://firebasestorage.googleapis.com/v0/b/copaguia-77b5a.appspot.com/o/placeholders%2Fbusiness-placeholder.jpg?alt=media'; // Ajustar luego si tienen uno específico

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

function mapGooglePlaceToNegocio(place: any, query: string) {
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

export async function syncBusinesses(apiKey: string): Promise<{ added: number; updated: number; deleted: number; total: number }> {
  const db = admin.firestore();
  db.settings({ ignoreUndefinedProperties: true });
  
  const allPlacesMap = new Map<string, any>();

  // Iterar por cada palabra clave y buscar
  for (const query of PALABRAS_CLAVES) {
    const places = await searchPlacesForQuery(query, apiKey);
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
    return isInsideCopacabana(place.location.latitude, place.location.longitude);
  });

  const businessesToSync = filteredPlaces.map(place => mapGooglePlaceToNegocio(place, place._matchedQuery));

  let addedCount = 0;
  let updatedCount = 0;

  const collectionRef = db.collection('negocios');

  for (const negocio of businessesToSync) {
    if (!negocio.id) continue;

    const docRef = collectionRef.doc(negocio.id);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      // Usamos merge: true para no sobreescribir imágenes u otra info que el dueño haya actualizado manualmente
      await docRef.set(negocio, { merge: true });
      updatedCount++;
    } else {
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
