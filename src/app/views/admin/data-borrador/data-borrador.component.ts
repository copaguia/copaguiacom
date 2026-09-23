import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    MatCardModule,
    MatTabsModule,
    MatListModule,
    MatTooltipModule
  ],
  templateUrl: './data-borrador.component.html',
  styleUrls: ['./data-borrador.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataBorradorComponent implements OnInit {
  private adminBorradorService = inject(AdminBorradorService);
  private router = inject(Router);
  private location = inject(Location);
  public authorization = inject(AuthorizationService);
  private snackBar = inject(MatSnackBar);

  public borradores = signal<any[]>([]);
  public estaCargando = signal<boolean>(true);
  public pendientes = signal<number>(0);
  public aprobados = signal<number>(0);
  public rankingValidadores = signal<Array<{ email: string; total: number; ultimaFecha: string }>>([]);
  public displayedColumns: string[] = ['nombre', 'categoria', 'seccion', 'direccion', 'telefono', 'acciones'];

  async ngOnInit() {
    if (!this.authorization.esAdmin() && !this.authorization.esAgente() && !this.authorization.esDev()) {
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

      const ranking = await this.adminBorradorService.obtenerRankingValidadores();
      this.rankingValidadores.set(ranking);
    } catch (error) {
      console.error('Error cargando borradores', error);
    } finally {
      this.estaCargando.set(false);
    }
  }

  // Método para copiar el link mágico de Wompi al portapapeles
  async copiarLinkMagico(id: string) {
    const link = `${window.location.origin}/reclamar/${id}`;
    try {
      await navigator.clipboard.writeText(link);
      this.snackBar.open('¡Link Mágico copiado al portapapeles!', 'OK', { duration: 3000 });
    } catch (err) {
      console.error('Error al copiar el link: ', err);
      this.snackBar.open('Error al copiar el link.', 'OK', { duration: 3000 });
    }
  }

  revisarBorrador(id: string) {
    this.router.navigate(['/admin/data-borrador/editar', id]);
  }

  goBack() {
    this.location.back();
  }
}
