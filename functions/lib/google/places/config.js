"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COPACABANA_BOUNDS = exports.PALABRAS_CLAVES = exports.SYNC_CONFIG = void 0;
exports.isInsideCopacabana = isInsideCopacabana;
exports.SYNC_CONFIG = {
    schedule: '0 3 * * *', // Todos los días a las 3:00 AM
    timeZone: 'America/Bogota', // Hora de Colombia
    timeoutSeconds: 540,
    memory: '256MiB',
};
exports.PALABRAS_CLAVES = [
    // Alimentos
    'Comida Rápida', 'Restaurantes', 'Pizzerias', 'Heladerias', 'Postres',
    'Cafeterias', 'Supermercados', 'Plaza de Mercado', 'Carnicerias',
    'Legumbrerias', 'Fruvers', 'Panaderias', 'Reposterias', 'Salmamentarias', 'Asaderos',
    // Comercios
    'Hogar', 'Celulares', 'Computadores', 'Tecnología', 'Cosméticos', 'Ropa', 'Calzado',
    'Papelerías', 'Librerias', 'Tiendas de Sentimientos', 'Joyerias', 'Repuestos',
    'Ferreterías', 'Agropecuarias', 'Tienda de Mascotas', 'Accesorios',
    'Cacharrería', 'Misceláneas', 'Desechables', 'Lencería', 'Fabricas',
    // Servicios
    'Belleza', 'Spa', 'Domicilios', 'Taxistas', 'Transporte', 'Acarreos',
    'Construcción', 'Talleres Automotrices', 'Talleres de Motos', 'Barberias',
    'Peluquerias Caninas', 'Cerrajería', 'Mecánicos', 'Electricos', 'Autolavados',
    'Herrería', 'Bicicletas', 'Publicidad', 'Encomiendas', 'Eventos', 'Decoración',
    'CDA', 'SOAT', 'Escuelas de Conducción', 'Inmobiliarias', 'Parqueaderos', 'Profesionales',
    // Entretenimiento
    'Día de Sol', 'Discotecas', 'Fincas para Eventos', 'Fondas', 'Senderismo',
    'Deportes', 'Billares',
    // Salud
    'Droguerías', 'Opticas', 'EPS', 'Hospitales', 'Odontólogos', 'Medicos',
    'Fisioterapia', 'Enfermeras',
    // Comunidad
    'Bancos', 'Cooperativas', 'Parroquias'
];
// Coordenadas aproximadas (Bounding Box) de Copacabana, Antioquia
exports.COPACABANA_BOUNDS = {
    low: {
        latitude: 6.326000,
        longitude: -75.545000,
    },
    high: {
        latitude: 6.376000,
        longitude: -75.476000,
    }
};
function isInsideCopacabana(lat, lng) {
    return (lat >= exports.COPACABANA_BOUNDS.low.latitude &&
        lat <= exports.COPACABANA_BOUNDS.high.latitude &&
        lng >= exports.COPACABANA_BOUNDS.low.longitude &&
        lng <= exports.COPACABANA_BOUNDS.high.longitude);
}
//# sourceMappingURL=config.js.map