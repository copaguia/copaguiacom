export interface RutaItem {
  rol: string;
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

export const RUTAS_MENU_ADMIN: RutaMenuAccion[] = [
  { ruta: 'admin/estadisticas',   etiqueta: 'Estadísticas',              icono: 'bar_chart',         color: 'primary' },
  { ruta: 'admin/agregar-negocio',etiqueta: 'Agregar Negocio',           icono: 'add_business' },
  { ruta: 'admin/data-borrador',  etiqueta: 'Aprobar Negocios',          icono: 'checklist',         divisorDespues: true },
  { accion: 'notificacion',       etiqueta: 'Crear Notificación Global', icono: 'notification_add',  color: 'accent' },
  { ruta: 'admin/publicidad',     etiqueta: 'Gestión de Publicidad',     icono: 'view_carousel',     color: 'accent' },
  { ruta: 'admin/sistema-pautas', etiqueta: 'Sistema de Pautas ADS',     icono: 'local_atm',         color: 'accent', divisorDespues: true }
];

export const ACCESOS_DIRECTOS = [
  { ruta: 'clasificados', etiqueta: 'Clasificados', icono: 'newspaper' },
  { ruta: 'marketplace',  etiqueta: 'Marketplace',  icono: 'storefront' }
] as const;

export const RUTAS_POR_ROL: RutaItem[] = [
  // Visitante
  { rol: 'visitante',   ruta: 'login',                        etiqueta: 'Login',                    icono: 'login' },
  { rol: 'visitante',   ruta: 'registro',                     etiqueta: 'Registro',                 icono: 'person_add' },
  { rol: 'visitante',   ruta: 'nav',                          etiqueta: 'Nav Menu',                 icono: 'menu' },
  { rol: 'visitante',   ruta: 'buscar',                       etiqueta: 'Buscar',                   icono: 'search' },
  { rol: 'visitante',   ruta: 'categorias',                   etiqueta: 'Categorías',               icono: 'category' },
  { rol: 'visitante',   ruta: 'seccion-page',                 etiqueta: 'Sección',                  icono: 'view_agenda' },
  { rol: 'visitante',   ruta: 'carrusel',                     etiqueta: 'Carrusel',                 icono: 'view_carousel' },
  { rol: 'visitante',   ruta: 'carrito-pedido',               etiqueta: 'Carrito Pedido',           icono: 'shopping_cart' },

  // Comerciante
  { rol: 'comerciante', ruta: 'onboarding-negocio-registro',  etiqueta: 'Onboarding Negocio',       icono: 'how_to_reg' },
  { rol: 'comerciante', ruta: 'marranito',                    etiqueta: 'Marranito',                icono: 'savings' },
  { rol: 'comerciante', ruta: 'perfil-negocio-editor',        etiqueta: 'Editor Negocio',           icono: 'edit' },
  { rol: 'comerciante', ruta: 'dashboard-dueno',              etiqueta: 'Dashboard Dueño',          icono: 'dashboard' },
  { rol: 'comerciante', ruta: 'gestion-catalogo',             etiqueta: 'Gestión Catálogo',         icono: 'inventory' },

  // Agente
  { rol: 'agente',      ruta: 'market-place-global',          etiqueta: 'Marketplace Global',       icono: 'storefront' },
  { rol: 'agente',      ruta: 'soporte-consola',              etiqueta: 'Soporte Consola',          icono: 'support_agent' },

  // Admin
  { rol: 'admin',       ruta: 'admin/promociones',            etiqueta: 'Promociones',              icono: 'local_offer' },
  { rol: 'admin',       ruta: 'admin/agregar-negocio',        etiqueta: 'Agregar Negocio',          icono: 'add_business' },
  { rol: 'admin',       ruta: 'admin/estadisticas',           etiqueta: 'Estadísticas',             icono: 'bar_chart',     color: 'primary' },
  { rol: 'admin',       ruta: 'admin/data-borrador',          etiqueta: 'Aprobar Negocios',         icono: 'checklist' },
  { rol: 'admin',       ruta: 'admin/publicidad',             etiqueta: 'Gestión Publicidad',       icono: 'view_carousel', color: 'accent' },
  { rol: 'admin',       ruta: 'admin/sistema-pautas',         etiqueta: 'Sistema Pautas ADS',       icono: 'local_atm',     color: 'accent' },

  // Dev
  { rol: 'dev',         ruta: 'admin/dev-dashboard',          etiqueta: 'Dev Dashboard (Costos)',   icono: 'settings_applications', color: 'primary' }
];
