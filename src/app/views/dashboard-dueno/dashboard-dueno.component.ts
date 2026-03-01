import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { AdministracionService } from '../../core/firebase/administracion.service.service';
import { InstanciaFirebase } from '../../core/firebase/instancias.service';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';

@Component({
  selector: 'app-dashboard-dueno',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatExpansionModule, MatChipsModule],
  templateUrl: './dashboard-dueno.component.html',
  styleUrl: './dashboard-dueno.component.css'
})
export class DashboardDuenoComponent implements OnInit, OnDestroy { 
  private firestore = inject(InstanciaFirebase).firestore;
  public adminService = inject(AdministracionService);
  public nombreNegocio = signal<string>('Cargando...');
  private negocioId    = 'ID_DEL_NEGOCIO_ACTUAL'; // Esto vendría de la Auth o URL

  ngOnInit(): void {
    this.adminService.escucharPedidos(this.negocioId);
  }

  public cambiarEstado(pedidoId: string, estado: string): void {
    this.adminService.actualizarEstadoPedido(this.negocioId, pedidoId, estado);
  }

  public async agregarProducto(negocioId: string, producto: any): Promise<void> {
    const negocioRef = doc(this.firestore, `negocios/${negocioId}`);
    await updateDoc(negocioRef, {
      catalogo: arrayUnion({ ...producto, id: crypto.randomUUID() })
    });
  }
  
  public async eliminarProducto(negocioId: string, producto: any): Promise<void> {
    const negocioRef = doc(this.firestore, `negocios/${negocioId}`);
    await updateDoc(negocioRef, {
      catalogo: arrayRemove(producto)
    });
  }




  // Estos datos vendrían de un Signal conectado a la subcolección 'metricas'
  public visitas = signal(1250);
  public pedidos = signal(45);

  public tasaConversion = computed(() => {
    const v = this.visitas();
    const p = this.pedidos();
    return v > 0 ? ((p / v) * 100).toFixed(1) : 0;
  });


  

  ngOnDestroy(): void {
    // Las suscripciones de collectionData se cierran automáticamente al destruir el componente
  }

}
