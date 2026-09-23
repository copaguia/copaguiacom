export const RUTAS_POR_ROL = [
  // Visitante
  { rol: 'visitante',   ruta: 'login',                        etiqueta: 'login' },
  { rol: 'visitante',   ruta: 'registro',                     etiqueta: 'registro' },
  { rol: 'visitante',   ruta: 'nav',                          etiqueta: 'nav-menu' },
  { rol: 'visitante',   ruta: 'buscar',                       etiqueta: 'buscar' },
  { rol: 'visitante',   ruta: 'categorias',                   etiqueta: 'categorias' },
  { rol: 'visitante',   ruta: 'seccion-page',                 etiqueta: 'seccion-page' },
  { rol: 'visitante',   ruta: 'carrusel',                     etiqueta: 'carrusel' },
  { rol: 'visitante',   ruta: 'carrito-pedido',               etiqueta: 'carrito-pedido' },

  // Comerciante
  { rol: 'comerciante', ruta: 'onboarding-negocio-registro',  etiqueta: 'onboarding-negocio-registro' },
  { rol: 'comerciante', ruta: 'marranito',                    etiqueta: 'marranito' },
  { rol: 'comerciante', ruta: 'perfil-negocio-editor',        etiqueta: 'perfil-negocio-editor' },
  { rol: 'comerciante', ruta: 'dashboard-dueno',              etiqueta: 'dashboard-dueno' },
  { rol: 'comerciante', ruta: 'gestion-catalogo',             etiqueta: 'gestion-catalogo' },

  // Agente
  { rol: 'agente',      ruta: 'market-place-global',          etiqueta: 'market-place-global' },
  { rol: 'agente',      ruta: 'soporte-consola',              etiqueta: 'soporte-consola' },

  // Admin
  { rol: 'admin',       ruta: 'admin/promociones',            etiqueta: 'admin/promociones' },
  { rol: 'admin',       ruta: 'admin/agregar-negocio',        etiqueta: 'admin/agregar-negocio' },
  { rol: 'admin',       ruta: 'admin/estadisticas',           etiqueta: 'admin/estadisticas' },
  { rol: 'admin',       ruta: 'admin/publicidad',             etiqueta: 'admin/publicidad' },
  { rol: 'admin',       ruta: 'admin/sistema-pautas',         etiqueta: 'admin/sistema-pautas' },

  // Dev
  { rol: 'dev',         ruta: 'admin/dev-dashboard',          etiqueta: 'admin/dev-dashboard (Costos)' }
] as const;
