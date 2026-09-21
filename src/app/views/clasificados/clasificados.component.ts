import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ClasificadosService } from '../../core/services/clasificados.service';
import { Clasificado } from '../../core/models/clasificado.model';

@Component({
  selector:    'app-imagen-dialog',
  standalone:  true,
  imports:     [MatIconModule, MatButtonModule, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host { display: flex; flex-direction: column; height: 100%; background: #000; }
    .dialog-close { position: absolute; top: 8px; right: 8px; color: #fff; z-index: 10; }
    img { width: 100%; height: 100%; object-fit: contain; display: block; }
    p { color: #fff; text-align: center; padding: 8px; margin: 0; font-size: .9rem; opacity: .8; }
  `],
  template: `
    <button mat-icon-button class="dialog-close" (click)="ref.close()">
      <mat-icon>close</mat-icon>
    </button>
    <img [src]="data.src" [alt]="data.titulo" />
    <p>{{ data.titulo }}</p>
  `,
})
export class ImagenDialogComponent {
  ref  = inject(MatDialogRef<ImagenDialogComponent>);
  data = inject<{ src: string; titulo: string }>(MAT_DIALOG_DATA);
}

const CATEGORIAS = [
  { label: 'Todos',        valor: '' },
  { label: 'Empleos',      valor: 'empleos' },
  { label: 'Inmuebles',    valor: 'inmuebles' },
  { label: 'Vehículos',    valor: 'vehiculos' },
  { label: 'Electrónica',  valor: 'electronica' },
  { label: 'Servicios',    valor: 'servicios' },
  { label: 'Mascotas',     valor: 'mascotas' },
  { label: 'Moda',         valor: 'moda' },
  { label: 'Educación',    valor: 'educacion' },
];

@Component({
  selector:        'app-clasificados',
  standalone:      true,
  imports:         [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, MatDividerModule, MatCardModule, MatTabsModule, MatDialogModule],
  templateUrl:     './clasificados.component.html',
  styleUrl:        './clasificados.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClasificadosComponent implements OnInit {
  router              = inject(Router);
  dialog              = inject(MatDialog);
  clasificadosService = inject(ClasificadosService);

  clasificados  = signal<Clasificado[]>([]);
  cargando      = signal(true);
  categoriaActiva = signal('');
  categorias    = CATEGORIAS;
  fechaHoy      = new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  listadoFiltrado = computed(() => {
    const cat = this.categoriaActiva();
    return cat ? this.clasificados().filter(c => c.categoria?.toLowerCase() === cat) : this.clasificados();
  });

  async ngOnInit() {
    try {
      const data = await this.clasificadosService.obtenerClasificados();
      this.clasificados.set(data);
    } catch (e) {
      console.error(e);
    } finally {
      this.cargando.set(false);
    }
  }

  seleccionarCategoria(index: number) { this.categoriaActiva.set(this.categorias[index].valor); }

  abrirImagen(src: string, titulo: string) {
    this.dialog.open(ImagenDialogComponent, {
      data:         { src, titulo },
      maxWidth:     '100vw',
      maxHeight:    '100vh',
      width:        '100vw',
      height:       '100vh',
      panelClass:   'imagen-fullscreen-dialog',
    });
  }

  volver() { this.router.navigate(['/categorias']); }
}
