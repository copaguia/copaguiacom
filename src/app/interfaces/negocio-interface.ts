export interface NegocioInterface {
  premium?: boolean; // Obsoleto, usar plan
  plan?: 'basico' | 'premium' | 'plus Premium';
  seccion:      string;
  imagen:       string;
    id:             string;
    nit?:           string;
    duenoId:        string;
    zonaAsignada?:  string; // Obsoleto
    zonasAsignadas?: string[]; // IDs de las zonas/directorios a los que pertenece
    nombre:         string;
    slug:           string;
    categoria:      'Alimentos' | 'Comercios' | 'Servicios' | 'Entretenimiento' | 'Salud' | 'Comunidad' | 'Oportunidades' | 'Inmuebles' | 'Educación' | 'Pasatiempos' | 'Noticias';
    descripcion:    string;
    logo:           string;
    banner:         string;
    galeria:        string[];
    ubicacion: {
      direccion:     string;
      barrio:        string;
      ciudad:        string;
      latitud:       number;
      longitud:      number;
      googleMapsUrl: string;
    };
    contacto: {
      direccion: string;
      whatsapp:      string; 
      telefono:      string;
      email:         string;
      redes: {
        instagram?:  string;
        facebook?:   string;
        tiktok?:     string;
        web?:        string;
      };
    };
    horarios: {
      lunes:         { abierto: boolean; apertura: string; cierre: string };
      martes:        { abierto: boolean; apertura: string; cierre: string };
      miercoles:     { abierto: boolean; apertura: string; cierre: string };
      jueves:        { abierto: boolean; apertura: string; cierre: string };
      viernes:       { abierto: boolean; apertura: string; cierre: string };
      sabado:        { abierto: boolean; apertura: string; cierre: string };
      domingo:       { abierto: boolean; apertura: string; cierre: string };
      festivos:      { abierto: boolean; apertura: string; cierre: string };
    };
    catalogo: {
      id:            string;
      nombre:        string;
      descripcion:   string;
      precio:        number;
      urlImagen?:    string;
      disponible:    boolean;
      categoriaItem: string;
      etiquetas:     string[];
      // --- Ajustes para Carrito ---
      permiteCantidades: boolean; 
      variantes?:        string[]; // Ej: ['Rojo', 'Azul'] o ['Familiar', 'Personal']
      unidadMedida?:     string;   // Ej: 'Kg', 'Porción', 'Unidad'
    }[];
    // --- Ajustes de Pedido ---
    configuracionPedido: {
      aceptaPedidos:     boolean;
      mensajeBienvenida?: string;
      costoDomicilio?:    number;
      pedidoMinimo?:      number;
    };
    rating:              number;
    totalResenas:        number;
    verificado:          boolean;
    destacado:           boolean;
    fechaRegistro:       string;
    fechaVerificacion?:  string | null;
    verificadoPorUid?:   string | null;
    verificadoPorEmail?: string | null;
    metadatos:           Record<string, unknown>;
  }