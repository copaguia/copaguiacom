import { Injectable, signal, computed, inject } from '@angular/core';
import { ItemCarrito } from '../../interfaces/item-carrito';
import { DatosClientePedido } from '../../interfaces/datos-cliente-pedido';
import { NegocioInterface } from '../../interfaces/negocio-interface';
import { addDoc, collection } from 'firebase/firestore';
import { InstanciaFirebase } from '../firebase/instancias.service';
import { PedidoSubColeccion } from '../../interfaces/pedido-sub-coleccion';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private firestore      = inject(InstanciaFirebase).firestore;

  public estado          = signal<ItemCarrito[]>([]);
  public cliente         = signal<DatosClientePedido | null>(null);

  public totalItems      = computed(() => this.estado().reduce((acc, item) => acc + item.cantidad, 0));
  public subtotalPedido  = computed(() => this.estado().reduce((acc, item) => acc + item.subtotal, 0));

  public agregarAlCarrito(producto: any, cantidad: number, variante?: string): void {
    const itemsActuales  = this.estado();
    const itemExistente  = itemsActuales.find(i => i.idProducto === producto.id && i.variante === variante);

    if (itemExistente) {
      itemExistente.cantidad += cantidad;
      itemExistente.subtotal = itemExistente.cantidad * itemExistente.precio;
      this.estado.set([...itemsActuales]);
    } else {
      const nuevoItem: ItemCarrito = {
        idProducto:      producto.id,
        nombre:          producto.nombre,
        precio:          producto.precio,
        cantidad:        cantidad,
        variante:        variante,
        subtotal:        cantidad * producto.precio
      };
      this.estado.set([...itemsActuales, nuevoItem]);
    }
  }

  public eliminarDelCarrito(idProducto: string, variante?: string): void {
    this.estado.update(items => items.filter(i => !(i.idProducto === idProducto && i.variante === variante)));
  }

  public limpiarCarrito(): void {
    this.estado.set([]);
  }

  public generarEnlaceWhatsApp(negocio: NegocioInterface): string {
    const datosCliente   = this.cliente();
    const listaProductos = this.estado();
    const numWhatsApp    = negocio.contacto.whatsapp.replace(/\D/g, '');
    
    let mensaje = `*Pedido para: ${negocio.nombre}*\n\n`;
    mensaje    += `*Cliente:* ${datosCliente?.nombre || 'No proporcionado'}\n`;
    mensaje    += `*Dirección:* ${datosCliente?.direccion || 'Recojo en local'}\n`;
    mensaje    += `*Pago:* ${datosCliente?.metodoPago || 'A convenir'}\n\n`;
    mensaje    += `*Detalle del pedido:*\n`;

    listaProductos.forEach(item => {
      const varianteInfo = item.variante ? ` (${item.variante})` : '';
      mensaje += `- ${item.cantidad}x ${item.nombre}${varianteInfo} - $${item.subtotal}\n`;
    });

    mensaje += `\n*TOTAL A PAGAR: $${this.subtotalPedido()}*`;
    
    if (datosCliente?.nota) {
      mensaje += `\n\n*Nota:* ${datosCliente.nota}`;
    }

    const uri = encodeURIComponent(mensaje);
    return `https://wa.me/${numWhatsApp}?text=${uri}`;
  }

  

  public async guardarPedidoEnFirebase(negocioId: string): Promise<void> {
    const pedidoRef = collection(this.firestore, `negocios/${negocioId}/pedidos`);
    const nuevoPedido: PedidoSubColeccion = {
      cliente:      this.cliente()!,
      items:        this.estado(),
      total:        this.subtotalPedido(),
      fecha:        new Date().toISOString(),
      estadoPedido: 'pendiente'
    };
  
    await addDoc(pedidoRef, nuevoPedido);
  }
  
  // Actualizamos el método enviarPedido
  public async enviarPedido(negocio: NegocioInterface): Promise<void> {
    await this.guardarPedidoEnFirebase(negocio.id); // Guardamos copia en el historial del negocio
    const url = this.generarEnlaceWhatsApp(negocio);
    window.open(url, '_blank');
    this.limpiarCarrito();
  }

}





// Fin del servicio de pedido para Cooaguia.com