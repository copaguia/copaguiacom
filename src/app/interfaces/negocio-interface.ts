export interface NegocioInterface {
    id:             string;
    duenoId:        string;
    nombre:         string;
    slug:           string;
    categoria:      'gastronomia' | 'comercio' | 'salud_belleza' | 'tecnico' | 'tecnologia' | 'institucional' | 'entretenimiento';
    subCategoria:   string;
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
      whatsapp:      string; // Número principal para recibir el pedido
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
    rating:         number;
    totalResenas:   number;
    verificado:     boolean;
    destacado:      boolean;
    fechaRegistro:  string;
    metadatos:      Record<string, any>;
  }