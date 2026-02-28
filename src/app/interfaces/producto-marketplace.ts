import { ItemCarrito } from "./item-carrito";

export interface ProductoMarketplace extends ItemCarrito {
urlImagen: any;
    negocioId:   string;
    nombreNegocio: string;
    slugNegocio:   string;
    logoNegocio:   string;
    barrio:        string;
  }