export interface DirectorioInterface {
  id: string; // ej. 'campoamor_medellin'
  dominio: string; // ej. 'campoamor.com' o 'campoamor.copaguia.com'
  nombre: string;
  descripcion: string;
  logoUrl: string;
  
  // Estrategia SEO Integrada de Excelencia
  seoConfig: {
    titleTemplate: string; // ej. 'CampoAmor | %s'
    metaDescription: string;
    keywords: string[];
    ogImage: string;
    schemaType: string; // ej. 'LocalBusiness', 'WebSite'
  };
  
  municipio: string;
  sector: string;
  agenteAsignadoId?: string; // ID del AGENTE responsable de esta zona
  activo: boolean;
  
  // Coordenadas geográficas exactas (trazadas por el DEV en el mapa)
  limitePoligonal?: Array<{lat: number, lng: number}>;
}
