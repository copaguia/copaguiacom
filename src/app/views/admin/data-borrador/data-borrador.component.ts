import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AdminBorradorService } from '../../../core/services/admin-borrador.service';
import { AuthorizationService } from '../../../core/auth/authorization.service';
import { NegocioInterface } from '../../../interfaces/negocio-interface';

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
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './data-borrador.component.html',
  styleUrls: ['./data-borrador.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataBorradorComponent implements OnInit {
  private adminBorradorService = inject(AdminBorradorService);
  private router               = inject(Router);
  private location             = inject(Location);
  public authorization         = inject(AuthorizationService);
  private snackBar             = inject(MatSnackBar);

  public borradores            = signal<NegocioInterface[]>([]);
  public verificados           = signal<NegocioInterface[]>([]);
  public estaCargando          = signal<boolean>(true);
  public pendientes            = signal<number>(0);
  public aprobados             = signal<number>(0);
  public rankingValidadores    = signal<Array<{ email: string; total: number; ultimaFecha: string }>>([]);
  public terminoBusqueda       = signal<string>('');
  public columnasPendientes: string[] = ['nombre', 'categoria', 'seccion', 'direccion', 'telefono', 'acciones'];
  public columnasVerificados: string[] = ['nombre', 'categoria', 'seccion', 'direccion', 'telefono', 'validador', 'acciones'];
  public displayedColumns: string[] = this.columnasPendientes;

  public borradoresFiltrados = computed(() => {
    const termino = this.normalizarTexto(this.terminoBusqueda());
    const lista   = this.borradores();
    if (!termino) return lista;
    return lista.filter(item => this.coincideCriterioBusqueda(item, termino));
  });

  public verificadosFiltrados = computed(() => {
    const termino = this.normalizarTexto(this.terminoBusqueda());
    const lista   = this.verificados();
    if (!termino) return lista;
    return lista.filter(item => this.coincideCriterioBusqueda(item, termino));
  });

  async ngOnInit(): Promise<void> {
    if (!this.authorization.esAdmin() && !this.authorization.esAgente() && !this.authorization.esDev()) {
      this.router.navigate(['/']);
      return;
    }
    await this.cargarBorradores();
  }

  async cargarBorradores(): Promise<void> {
    this.estaCargando.set(true);
    try {
      const [dataPendientes, dataVerificados, countAprobados, ranking] = await Promise.all([
        this.adminBorradorService.obtenerBorradoresPendientes(),
        this.adminBorradorService.obtenerNegociosVerificados(),
        this.adminBorradorService.obtenerConteo('Aprobado'),
        this.adminBorradorService.obtenerRankingValidadores()
      ]);
      this.borradores.set(dataPendientes);
      this.verificados.set(dataVerificados);
      this.pendientes.set(dataPendientes.length);
      this.aprobados.set(countAprobados);
      this.rankingValidadores.set(ranking);
    } catch (error) {
      console.error('Error cargando borradores', error);
      this.snackBar.open('Error al cargar la información', 'OK', { duration: 3000 });
    } finally {
      this.estaCargando.set(false);
    }
  }

  async copiarLinkMagico(id: string): Promise<void> {
    const link = `${window.location.origin}/reclamar/${id}`;
    try {
      await navigator.clipboard.writeText(link);
      this.snackBar.open('¡Link Mágico copiado al portapapeles!', 'OK', { duration: 3000 });
    } catch (err) {
      console.error('Error al copiar el link: ', err);
      this.snackBar.open('Error al copiar el link.', 'OK', { duration: 3000 });
    }
  }

  async quitarVerificacion(id: string): Promise<void> {
    if (!this.authorization.esAdmin() && !this.authorization.esDev()) {
      this.snackBar.open('No tienes permisos para quitar la verificación', 'OK', { duration: 3000 });
      return;
    }
    try {
      await this.adminBorradorService.desverificarNegocio(id);
      this.snackBar.open('Verificación removida exitosamente', 'OK', { duration: 3000 });
      await this.cargarBorradores();
    } catch (error) {
      console.error('Error al quitar verificación', error);
      this.snackBar.open('Error al remover la verificación', 'OK', { duration: 3000 });
    }
  }

  revisarBorrador(id: string): void {
    this.router.navigate(['/admin/data-borrador/editar', id]);
  }

  actualizarBusqueda(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    this.terminoBusqueda.set(input.value);
  }

  limpiarBusqueda(): void {
    this.terminoBusqueda.set('');
  }

  private normalizarTexto(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  private coincideCriterioBusqueda(negocio: NegocioInterface, termino: string): boolean {
    const idCompleto = this.normalizarTexto(negocio.id || '');
    const idUltimos6 = idCompleto.slice(-6);
    if (idUltimos6.includes(termino) || idCompleto.includes(termino)) {
      return true;
    }

    const nit = this.normalizarTexto(negocio.nit || (typeof negocio.metadatos?.['nit'] === 'string' ? (negocio.metadatos['nit'] as string) : ''));
    if (nit.includes(termino)) {
      return true;
    }

    const telefono = this.normalizarTexto(negocio.contacto?.telefono || '');
    const whatsapp = this.normalizarTexto(negocio.contacto?.whatsapp || '');
    if (telefono.includes(termino) || whatsapp.includes(termino)) {
      return true;
    }

    const digitosTermino = termino.replace(/\D/g, '');
    if (digitosTermino.length > 0) {
      const digitosTel = telefono.replace(/\D/g, '');
      const digitosWsp = whatsapp.replace(/\D/g, '');
      const digitosNit = nit.replace(/\D/g, '');
      if (digitosTel.includes(digitosTermino) || digitosWsp.includes(digitosTermino) || (digitosNit.length > 0 && digitosNit.includes(digitosTermino))) {
        return true;
      }
    }

    return false;
  }

  goBack(): void {
    this.location.back();
  }
}
