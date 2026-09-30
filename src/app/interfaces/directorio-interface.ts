export interface DirectorioInterface {
  id: string; // ej. 'niquia'
  dominio: string; // ej. 'niquia.com'
  nombre: string; // ej. 'Niquía'
  descripcion: string;
  logoUrl: string;
  fondoUrl?: string; // Imagen de fondo para el login/UI principal
  
  seoConfig: {
    titleTemplate: string;
    metaDescription: string;
    keywords: string[];
    ogImage: string;
    schemaType: string;
  };
  
  municipio: string;
  sector: string;
  agenteAsignadoId?: string;
  activo: boolean;
  
  areaBusquedaApify?: {
    lat: number;
    lng: number;
    radioKm: number;
  };
  _mapaActivo?: boolean;

  tema?: {
    corporativo: string;
    secundario: string;
    resaltante: string;
  };
}

export interface MunicipioGlobal {
  id: string; // 'bello'
  nombre: string; // 'Bello'
  subregion: string;
  directorios: Record<string, DirectorioInterface>; 
  limitePoligonal?: any;
}
