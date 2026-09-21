import { Injectable, inject, signal } from '@angular/core';
import { InstanciaFirebase } from '../firebase/instancias.service';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { Clasificado } from '../models/clasificado.model';

@Injectable({
  providedIn: 'root'
})
export class ClasificadosService {
  private firestore = inject(InstanciaFirebase).firestore;

  async obtenerClasificados(limite: number = 20): Promise<Clasificado[]> {
    try {
      // Usaremos mocks por ahora si la colección no existe, pero dejamos lista la consulta a Firebase
      const q = query(
        collection(this.firestore, 'clasificados'),
        where('estado', '==', 'activo'),
        orderBy('fechaPublicacion', 'desc'),
        limit(limite)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return this.getMockClasificados();
      }

      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Clasificado));
    } catch (error) {
      console.warn('Error obteniendo clasificados (posiblemente la colección no existe aún), usando mocks.', error);
      return this.getMockClasificados();
    }
  }

  private getMockClasificados(): Clasificado[] {
    return [
      {
        id: '1', titulo: 'Apartamento nuevo en El Poblado', premium: true,
        imagen: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&q=80',
        descripcion: 'Apto 65m², 2 hab., 2 baños, balcón, vigilancia 24h. Entrega inmediata.',
        categoria: 'inmuebles', fechaPublicacion: new Date().toISOString(),
        precio: 320000000, contactoTelefono: '3001234567', estado: 'activo',
      },
      {
        id: '2', titulo: 'Se vende Toyota Hilux 2022', premium: true,
        imagen: 'https://images.unsplash.com/photo-1586336153815-73c7f89a2ce1?w=300&q=80',
        descripcion: '4x4, diesel, único dueño, 45.000 km, full equipo. Permuta por menor valor.',
        categoria: 'vehiculos', fechaPublicacion: new Date().toISOString(),
        precio: 145000000, contactoTelefono: '3119876543', estado: 'activo',
      },
      {
        id: '3', titulo: 'Se solicita ayudante de construcción',
        descripcion: 'Para obra en el centro. Pago semanal. Experiencia mínima de 6 meses.',
        categoria: 'empleos', fechaPublicacion: new Date().toISOString(),
        contactoTelefono: '3205554433', estado: 'activo',
      },
      {
        id: '4', titulo: 'Vendo bicicleta todoterreno rin 29',
        descripcion: 'Casi nueva, frenos de disco. Negociable.',
        categoria: 'vehiculos', fechaPublicacion: new Date().toISOString(),
        precio: 350000, contactoTelefono: '3216661122', estado: 'activo',
      },
      {
        id: '5', titulo: 'iPhone 15 Pro 256 GB',
        descripcion: 'Como nuevo, caja original, garantía vigente.',
        categoria: 'electronica', fechaPublicacion: new Date().toISOString(),
        precio: 4200000, contactoTelefono: '3007778899', estado: 'activo',
      },
      {
        id: '6', titulo: 'Clases particulares de matemáticas',
        descripcion: 'Todos los niveles, bachillerato y universidad. Virtual o presencial.',
        categoria: 'educacion', fechaPublicacion: new Date().toISOString(),
        contactoTelefono: '3143332211', estado: 'activo',
      },
      {
        id: '7', titulo: 'Golden retriever cachorros',
        descripcion: 'Pedigree, vacunados, desparasitados. 2 hembras disponibles.',
        categoria: 'mascotas', fechaPublicacion: new Date().toISOString(),
        precio: 1800000, contactoTelefono: '3188880011', estado: 'activo',
      },
      {
        id: '8', titulo: 'Técnico en refrigeración a domicilio',
        descripcion: 'Neveras, aires acondicionados. Garantía del servicio.',
        categoria: 'servicios', fechaPublicacion: new Date().toISOString(),
        contactoTelefono: '3124445566', estado: 'activo',
      },
    ];
  }
}
