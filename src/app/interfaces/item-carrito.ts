export interface ItemCarrito {
    idProducto: string;
    nombre:     string;
    precio:     number;
    cantidad:   number;
    variante?:  string;
    subtotal:   number;
  }