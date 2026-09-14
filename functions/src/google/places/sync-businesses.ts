import * as admin from 'firebase-admin';
import { PALABRAS_CLAVES, isInsideCopacabana } from './config';
import { searchPlacesForQuery } from './api';
import { NegocioInterface } from '../../interfaces/negocio-interface';

// Placeholder URL predeterminado según solicitud del usuario
const PLACEHOLDER_IMAGE = 'https://firebasestorage.googleapis.com/v0/b/copaguia-77b5a.appspot.com/o/placeholders%2Fbusiness-placeholder.jpg?alt=media'; // Ajustar luego si tienen uno específico

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

function getCategoriaForQuery(query: string): NegocioInterface['categoria'] {
  const q = query.toLowerCase();
  
  if (['comida rápida', 'restaurantes', 'pizzerias', 'heladerias', 'postres', 'cafeterias', 'supermercados', 'plaza de mercado', 'carnicerias', 'legumbrerias', 'fruvers', 'panaderias', 'reposterias', 'salmamentarias', 'asaderos'].includes(q)) return 'Alimentos';
  if (['hogar', 'celulares', 'computadores', 'tecnología', 'cosméticos', 'ropa', 'calzado', 'papelerías', 'librerias', 'tiendas de sentimientos', 'joyerias', 'repuestos', 'ferreterías', 'agropecuarias', 'tienda de mascotas', 'accesorios', 'cacharrería', 'misceláneas', 'desechables', 'lencería', 'fabricas'].includes(q)) return 'Comercios';
  if (['belleza', 'spa', 'domicilios', 'taxistas', 'transporte', 'acarreos', 'construcción', 'talleres automotrices', 'talleres de motos', 'barberias', 'peluquerias caninas', 'cerrajería', 'mecánicos', 'electricos', 'autolavados', 'herrería', 'bicicletas', 'publicidad', 'encomiendas', 'eventos', 'decoración', 'cda', 'soat', 'escuelas de conducción', 'inmobiliarias', 'parqueaderos', 'profesionales'].includes(q)) return 'Servicios';
  if (['día de sol', 'discotecas', 'fincas para eventos', 'fondas', 'senderismo', 'deportes', 'billares'].includes(q)) return 'Entretenimiento';
  if (['droguerías', 'opticas', 'eps', 'hospitales', 'odontólogos', 'medicos', 'fisioterapia', 'enfermeras'].includes(q)) return 'Salud';
  if (['bancos', 'cooperativas', 'parroquias'].includes(q)) return 'Comunidad';

  return 'Comercios'; // Default fallback
}

function mapGooglePlaceToNegocio(place: any, query: string): NegocioInterface {
  const name = place.displayName?.text || 'Negocio sin nombre';
  const phone = place.nationalPhoneNumber || place.internationalPhoneNumber || '';
  
  let whatsappLink = '';
  if (phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    const waPhone = cleanPhone.startsWith('57') ? cleanPhone : `57${cleanPhone}`;
    whatsappLink = `https://wa.me/${waPhone}`;
  }

  const lat = place.location?.latitude || 0;
  const lng = place.location?.longitude || 0;
  const googleMapsUrl = lat && lng ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}` : '';

  const slug = generateSlug(name);
  
  // Asignar una categoría principal válida según la interfaz
  let categoriaBase: NegocioInterface['categoria'] = getCategoriaForQuery(query);

  return {
    id: place.id,
    duenoId: '', // Vacío hasta que lo reclamen
    nombre: name,
    slug: slug,
    seccion: query,
    categoria: categoriaBase,
    descripcion: `Negocio de ${query.toLowerCase()} ubicado en Copacabana.`,
    imagen: PLACEHOLDER_IMAGE,
    logo: PLACEHOLDER_IMAGE,
    banner: PLACEHOLDER_IMAGE,
    galeria: [],
    ubicacion: {
      direccion: place.formattedAddress || 'Copacabana, Antioquia',
      barrio: 'Copacabana',
      ciudad: 'Copacabana',
      latitud: lat,
      longitud: lng,
      googleMapsUrl: googleMapsUrl,
    },
    contacto: {
      direccion: place.formattedAddress || 'Copacabana, Antioquia',
      whatsapp: whatsappLink,
      telefono: phone,
      email: '',
      redes: {}
    },
    rating: 0,
    totalResenas: 0,
    verificado: false,
    destacado: false,
    fechaRegistro: new Date().toISOString(),
    metadatos: { origen: 'google_places_sync' },
    horarios: {
      lunes: { abierto: true, apertura: '08:00', cierre: '18:00' },
      martes: { abierto: true, apertura: '08:00', cierre: '18:00' },
      miercoles: { abierto: true, apertura: '08:00', cierre: '18:00' },
      jueves: { abierto: true, apertura: '08:00', cierre: '18:00' },
      viernes: { abierto: true, apertura: '08:00', cierre: '18:00' },
      sabado: { abierto: true, apertura: '08:00', cierre: '14:00' },
      domingo: { abierto: false, apertura: '', cierre: '' },
      festivos: { abierto: false, apertura: '', cierre: '' },
    },
    catalogo: [],
    configuracionPedido: {
      aceptaPedidos: false
    }
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
