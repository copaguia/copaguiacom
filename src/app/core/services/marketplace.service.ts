import { Injectable, inject } from '@angular/core';
import { InstanciaFirebase } from '../firebase/instancias.service';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { MarketplaceItem } from '../models/marketplace.model';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {
  private firestore = inject(InstanciaFirebase).firestore;

  async obtenerItems(limite: number = 20): Promise<MarketplaceItem[]> {
    try {
      const q = query(
        collection(this.firestore, 'marketplace_items'),
        where('estado', '==', 'disponible'),
        orderBy('fechaPublicacion', 'desc'),
        limit(limite)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return this.getMockItems();
      }

      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MarketplaceItem));
    } catch (error) {
      console.warn('Error obteniendo items de marketplace (posiblemente la colección no existe aún), usando mocks.', error);
      return this.getMockItems();
    }
  }

  private getMockItems(): MarketplaceItem[] {
    return [
      {
        id: '1',
        titulo: 'iPhone 13 Pro Max',
        descripcion: 'Excelente estado, 128GB, libre para cualquier operador. Batería al 90%.',
        precio: 3200000,
        imagenUrl: 'https://images.unsplash.com/photo-1632661674596-618d8b64d641?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        vendedorId: 'v1',
        ubicacion: 'Medellín',
        condicion: 'Usado',
        fechaPublicacion: new Date().toISOString(),
        estado: 'disponible'
      },
      {
        id: '2',
        titulo: 'PlayStation 5 con 2 controles',
        descripcion: 'Incluye FIFA 24 y Spiderman 2. Como nueva, en caja original.',
        precio: 2500000,
        imagenUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        vendedorId: 'v2',
        ubicacion: 'Envigado',
        condicion: 'Usado',
        fechaPublicacion: new Date(Date.now() - 86400000).toISOString(),
        estado: 'disponible'
      },
      {
        id: '3',
        titulo: 'Zapatillas Nike Air Max',
        descripcion: 'Talla 42, originales. Se entregan en caja.',
        precio: 450000,
        imagenUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        vendedorId: 'v3',
        ubicacion: 'Bello',
        condicion: 'Nuevo',
        fechaPublicacion: new Date(Date.now() - 172800000).toISOString(),
        estado: 'disponible'
      },
      {
        id: '4',
        titulo: 'Portátil Lenovo ThinkPad',
        descripcion: 'Core i7, 16GB RAM, 512GB SSD. Ideal para trabajo pesado.',
        precio: 1800000,
        imagenUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        vendedorId: 'v4',
        ubicacion: 'Itagüí',
        condicion: 'Reacondicionado',
        fechaPublicacion: new Date(Date.now() - 259200000).toISOString(),
        estado: 'disponible'
      }
    ];
  }
}
