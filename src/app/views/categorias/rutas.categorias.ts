export interface RutaItem {
  ruta: string;
  etiqueta: string;
  icono?: string;
  color?: string;
}

export interface RutaMenuAccion {
  ruta?: string;
  accion?: 'notificacion';
  etiqueta: string;
  icono: string;
  color?: string;
  divisorDespues?: boolean;
}

export const ACCESOS_DIRECTOS = [
  { ruta: 'clasificados', etiqueta: 'Clasificados', icono: 'newspaper' },
  { ruta: 'marketplace',  etiqueta: 'Marketplace',  icono: 'storefront' }
] as const;

export const RUTAS_VISITANTE: RutaItem[] = [
  { ruta: 'login',          etiqueta: 'Login',          icono: 'login' },
  { ruta: 'registro',       etiqueta: 'Registro',       icono: 'person_add' },
  { ruta: 'nav',            etiqueta: 'Nav Menu',       icono: 'menu' },
  { ruta: 'buscar',         etiqueta: 'Buscar',         icono: 'search' },
  { ruta: 'categorias',     etiqueta: 'Categorías',     icono: 'category' },
  { ruta: 'seccion-page',   etiqueta: 'Sección',        icono: 'view_agenda' },
  { ruta: 'carrusel',       etiqueta: 'Carrusel',       icono: 'view_carousel' },
  { ruta: 'carrito-pedido', etiqueta: 'Carrito Pedido', icono: 'shopping_cart' }
];

export const RUTAS_COMERCIANTE: RutaItem[] = [
  { ruta: 'dashboard-dueno',             etiqueta: 'Dashboard Dueño',    icono: 'dashboard' },
  { ruta: 'gestion-catalogo',            etiqueta: 'Gestión Catálogo',   icono: 'inventory' },
  { ruta: 'marranito',                   etiqueta: 'Marranito',          icono: 'savings' },
  { ruta: 'onboarding-negocio-registro', etiqueta: 'Onboarding Negocio', icono: 'how_to_reg' }
];

export const RUTAS_AGENTE: RutaItem[] = [
  { ruta: 'market-place-global', etiqueta: 'Marketplace Global', icono: 'storefront' },
  { ruta: 'soporte-consola',     etiqueta: 'Soporte Consola',    icono: 'support_agent' }
];

export const RUTAS_ADMIN: RutaMenuAccion[] = [
  { ruta: 'admin/estadisticas',   etiqueta: 'Estadísticas',              icono: 'bar_chart',         color: 'primary' },
  { ruta: 'admin/agregar-negocio',etiqueta: 'Agregar Negocio',           icono: 'add_business' },
  { ruta: 'admin/data-borrador',  etiqueta: 'Aprobar Negocios',          icono: 'checklist',         divisorDespues: true },
  { accion: 'notificacion',       etiqueta: 'Crear Notificación Global', icono: 'notification_add',  color: 'accent' },
  { ruta: 'admin/publicidad',     etiqueta: 'Gestión de Publicidad',     icono: 'view_carousel',     color: 'accent' },
  { ruta: 'admin/sistema-pautas', etiqueta: 'Sistema de Pautas ADS',     icono: 'local_atm',         color: 'accent' },
  { ruta: 'admin/promociones',    etiqueta: 'Promociones',               icono: 'local_offer' }
];

export const RUTAS_DEV: RutaItem[] = [
  { ruta: 'admin/dev-dashboard',  etiqueta: 'Dev Dashboard (Tenants & Costos)', icono: 'settings_applications', color: 'primary' }
];
