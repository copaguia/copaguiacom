import { DatosClientePedido } from "./datos-cliente-pedido";
import { ItemCarrito } from "./item-carrito";

export interface PedidoSubColeccion {
    id?:            string;
    cliente:        DatosClientePedido;
    items:          ItemCarrito[];
    total:          number;
    fecha:          string; // ISO String
    estadoPedido:   'pendiente' | 'completado' | 'cancelado';
  }