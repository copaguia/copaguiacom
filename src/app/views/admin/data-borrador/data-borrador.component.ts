import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { AdminBorradorService } from '../../../core/services/admin-borrador.service';
import { AuthorizationService } from '../../../core/auth/authorization.service';

@Component({
  selector: 'app-data-borrador',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule, 
    MatProgressSpinnerModule,
    MatChipsModule,
    MatCardModule
  ],
  templateUrl: './data-borrador.component.html',
  styleUrls: ['./data-borrador.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataBorradorComponent implements OnInit {
  private adminBorradorService = inject(AdminBorradorService);
  private router = inject(Router);
  public authorization = inject(AuthorizationService);

  public borradores = signal<any[]>([]);
  public estaCargando = signal<boolean>(true);
  public pendientes = signal<number>(0);
  public aprobados = signal<number>(0);
  public displayedColumns: string[] = ['nombre', 'categoria', 'seccion', 'direccion', 'acciones'];

  async ngOnInit() {
    if (!this.authorization.esAdmin()) {
      this.router.navigate(['/']);
      return;
    }
    await this.cargarBorradores();
  }

  async cargarBorradores() {
    this.estaCargando.set(true);
    try {
      const data = await this.adminBorradorService.obtenerBorradoresPendientes();
      this.borradores.set(data);
      this.pendientes.set(data.length);
      
      const countAprobados = await this.adminBorradorService.obtenerConteo('Aprobado');
      this.aprobados.set(countAprobados);
    } catch (error) {
      console.error('Error cargando borradores', error);
    } finally {
      this.estaCargando.set(false);
    }
  }

  revisarBorrador(id: string) {
    this.router.navigate(['/admin/data-borrador/editar', id]);
  }
}
