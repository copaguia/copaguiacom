import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToolBarPageComponent } from '../tool-bar-page/tool-bar-page.component';
import { NegocioInterface } from '../../../interfaces/negocio-interface';
import { AuthorizationService } from '../../../core/auth/authorization.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { InstanciaFirebase } from '../../../core/firebase/instancias.service';
import { collection, onSnapshot, query, where, DocumentData } from 'firebase/firestore';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BuscadorComponent } from '../buscador/buscador.component';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlanesNegocioDialogComponent } from '../planes-negocio-dialog/planes-negocio-dialog.component';

enum LoadingState {
  Idle = 'idle',
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}

@Component({
  selector: 'app-categoria-page',
  imports: [
    CommonModule,
    ToolBarPageComponent,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    BuscadorComponent,
    RouterModule,
    MatDialogModule
  ],
  standalone: true,
  templateUrl: './categoria-page.component.html',
  styleUrls: ['./categoria-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriaPageComponent implements OnInit {

  private firestore = inject(InstanciaFirebase).firestore;
  private route = inject(ActivatedRoute);
  public authorization = inject(AuthorizationService);

  private destroyRef = inject(DestroyRef);
  private unsubscribeSnapshot: (() => void) | null = null;

  public title: string = '';
  public categoria: string = '';
  public seccion: string = '';

  public negocios = signal<NegocioInterface[]>([]);
  public negociosFiltrados = signal<NegocioInterface[]>([]);
  public loadingState = signal<LoadingState>(LoadingState.Idle);
  public loadingProgress = signal<number>(0);
  public error = signal<string | null>(null);
  public isLoading = computed(() => this.loadingState() === LoadingState.Loading);
  public terminoBusqueda = signal<string>('');

  public trackByNegocioId(index: number, negocio: NegocioInterface): string { return negocio.id; }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.title = data['title'] || '';
      this.categoria = data['categoria'] || '';
      this.seccion = data['seccion'] || '';
      this.buscarNegocios();
    });

    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.terminoBusqueda.set(params['q']);
        // Como los negocios podrían no haber cargado aún, filtrarNegocios se llama cuando lleguen,
        // pero por si acaso, lo llamamos también aquí si ya llegaron.
        if (this.negocios().length > 0) {
          this.filtrarNegocios();
        }
      }
    });
  }

  buscarNegocios() {
    if (!this.categoria) return;

    this.loadingState.set(LoadingState.Loading);
    this.error.set(null);

    // Limpiar suscripción previa si la hay
    if (this.unsubscribeSnapshot) {
      this.unsubscribeSnapshot();
      this.unsubscribeSnapshot = null;
    }

    try {
      let q;
      if (this.categoria && this.seccion) {
        q = query(
          collection(this.firestore, 'negocios'),
          where('categoria', '==', this.categoria),
          where('seccion', '==', this.seccion)
        );
      } else {
        q = query(
            collection(this.firestore, 'negocios'),
            where('categoria', '==', this.categoria)
        );
      }

      this.unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
        let negocios = querySnapshot.docs.map(doc => {
          const data = doc.data() as DocumentData;
          return { id: doc.id, ...data } as NegocioInterface;
        });

        // Ordenar: Plus Premium primero (o verificados)
        negocios = negocios.sort((a, b) => {
          if (a.plan === 'plus Premium' && b.plan !== 'plus Premium') return -1;
          if (a.plan !== 'plus Premium' && b.plan === 'plus Premium') return 1;
          if (a.verificado && !b.verificado) return -1;
          if (!a.verificado && b.verificado) return 1;
          return 0;
        });

        const isFirstLoad = this.loadingState() === LoadingState.Loading;
        if (isFirstLoad) {
          this.loadingProgress.set(0);
          const interval = setInterval(() => {
            this.loadingProgress.update(val => Math.min(val + (100 / (4000 / 50)), 100));
          }, 50);

          setTimeout(() => {
            clearInterval(interval);
            this.negocios.set(negocios);
            this.filtrarNegocios();
            this.loadingState.set(LoadingState.Success);
          }, 4000);
        } else {
          this.negocios.set(negocios);
          this.filtrarNegocios();
        }
      }, (e) => {
        console.error(e);
        this.error.set('Error al escuchar cambios en negocios');
        this.loadingState.set(LoadingState.Error);
      });

      // Asegurar que nos desuscribimos al destruir el componente
      this.destroyRef.onDestroy(() => {
        if (this.unsubscribeSnapshot) {
          this.unsubscribeSnapshot();
        }
      });

    } catch (e) {
      console.error(e);
      this.error.set('Error al inicializar consulta');
      this.loadingState.set(LoadingState.Error);
    }
  }

  public filtrarNegocios() {
    const termino = this.terminoBusqueda().toLowerCase();
    if (!termino) {
      this.negociosFiltrados.set(this.negocios());
    } else {
      this.negociosFiltrados.set(
        this.negocios().filter(negocio =>
          negocio.nombre.toLowerCase().includes(termino) ||
          (negocio.descripcion && negocio.descripcion.toLowerCase().includes(termino))
        )
      );
    }
  }

  public estaAbierto(negocio: NegocioInterface): boolean {
    if (!negocio.horarios) return false;
    const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const hoy = new Date();
    const diaString = dias[hoy.getDay()] as keyof typeof negocio.horarios;
    
    const horarioHoy = negocio.horarios[diaString];
    if (!horarioHoy || !horarioHoy.abierto || !horarioHoy.apertura || !horarioHoy.cierre) {
      return false;
    }

    const horaLocal = hoy.getHours();
    const minLocal = hoy.getMinutes();
    const [hA, mA] = horarioHoy.apertura.split(':').map(Number);
    const [hC, mC] = horarioHoy.cierre.split(':').map(Number);

    if (isNaN(hA) || isNaN(mA) || isNaN(hC) || isNaN(mC)) return false;
    
    const actualMin = horaLocal * 60 + minLocal;
    const apertMin = hA * 60 + mA;
    const cierreMin = hC * 60 + mC;
    
    return actualMin >= apertMin && actualMin <= cierreMin;
  }

  private dialog = inject(MatDialog);

  public limpiarDireccion(direccion: string): string {
    if (!direccion) return '';
    return direccion
      .replace(/,?\s*copacabana\b/gi, '')
      .replace(/,?\s*antioquia\b/gi, '')
      .replace(/,\s*$/, '')
      .trim();
  }

  public handleClickPerfil(item: NegocioInterface, event: Event) {
    if (!item.plan || item.plan === 'basico') {
      event.preventDefault();
      event.stopPropagation();
      if (this.authorization.esComerciante()) {
        this.dialog.open(PlanesNegocioDialogComponent, {
          width: '95vw',
          maxWidth: '1000px',
          panelClass: 'custom-dialog-container',
          backdropClass: 'blur-backdrop'
        });
      } else {
        this.dialog.open(PerfilNoCreadoDialogComponent, {
          width: '90vw',
          maxWidth: '400px',
          panelClass: 'custom-dialog-container',
          backdropClass: 'blur-backdrop',
          data: { negocioId: item.id }
        });
      }
    }
  }

  public abrirEdicionAdmin(item: NegocioInterface, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    // this.dialog.open(AdminEditNegocioDialogComponent, {
    //   width: '95vw',
    //   maxWidth: '900px',
    //   panelClass: 'custom-dialog-container',
    //   backdropClass: 'white-backdrop',
    //   data: { negocio: item }
    // });
    console.log("AdminEditNegocioDialogComponent eliminado. Funcionalidad deshabilitada.");
  }

  public contactarWhatsApp(item: NegocioInterface, event: Event) {
    if (!this.estaAbierto(item)) {
      event.preventDefault();
      event.stopPropagation();
      this.dialog.open(NegocioCerradoDialogComponent, {
        width: '90vw',
        maxWidth: '400px',
        panelClass: 'custom-dialog-container',
        backdropClass: 'blur-backdrop'
      });
    }
  }

  public getFraseCarga(): string {
    if (!this.title) return 'Cargando...';
    
    const titulo = this.title.toLowerCase();
    
    if (titulo.includes('restaurante') || titulo.includes('comida') || titulo.includes('pizza') || titulo.includes('hamburguesa') || titulo.includes('café') || titulo.includes('postre') || titulo.includes('licor')) {
      return `Preparando la mesa con las mejores opciones de ${this.title}...`;
    }
    if (titulo.includes('ropa') || titulo.includes('moda') || titulo.includes('boutique') || titulo.includes('calzado')) {
      return `Buscando el mejor estilo en ${this.title} para ti...`;
    }
    if (titulo.includes('salud') || titulo.includes('farmacia') || titulo.includes('médico') || titulo.includes('dental')) {
      return `Priorizando tu bienestar, buscando en ${this.title}...`;
    }
    if (titulo.includes('mascota') || titulo.includes('veterinaria')) {
      return `Rastreando los lugares perfectos para tus peluditos en ${this.title}...`;
    }
    if (titulo.includes('auto') || titulo.includes('moto') || titulo.includes('mecánic') || titulo.includes('taller')) {
      return `Acelerando motores para encontrar lo mejor en ${this.title}...`;
    }
    if (titulo.includes('hogar') || titulo.includes('ferretería') || titulo.includes('mueble') || titulo.includes('construcción')) {
      return `Construyendo la lista de los mejores sitios de ${this.title}...`;
    }
    if (titulo.includes('belleza') || titulo.includes('peluquería') || titulo.includes('barbería') || titulo.includes('spa')) {
      return `Buscando el lugar ideal para resaltar tu estilo en ${this.title}...`;
    }
    if (titulo.includes('tecnología') || titulo.includes('celular') || titulo.includes('computador')) {
      return `Procesando y conectando con lo mejor en ${this.title}...`;
    }

    const variaciones = [
      `Explorando las mejores opciones de ${this.title}...`,
      `Recolectando los sitios más destacados de ${this.title}...`,
      `Filtrando la excelencia en ${this.title} para ti...`,
      `Conectándote con los mejores negocios de ${this.title}...`
    ];
    return variaciones[titulo.length % variaciones.length];
  }
}

@Component({
  selector: 'app-negocio-cerrado-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div style="padding: 32px 24px; text-align: center; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);">
      <div style="display: flex; justify-content: center; margin-bottom: 16px;">
        <div style="background-color: #fee2e2; border-radius: 50%; padding: 16px; display: inline-flex;">
          <mat-icon style="font-size: 40px; height: 40px; width: 40px; color: #ef4444;">schedule</mat-icon>
        </div>
      </div>
      <h2 style="margin: 0 0 12px; font-weight: 700; font-size: 1.5rem; color: #1f2937;">Negocio Cerrado</h2>
      <p style="color: #4b5563; margin: 0 0 24px; font-size: 1.05rem; line-height: 1.5;">
        En este momento el negocio se encuentra cerrado o no está en horario de apertura.
      </p>
      <button mat-flat-button color="primary" style="width: 100%; padding: 8px 0; border-radius: 8px; font-size: 1rem; font-weight: 600;" (click)="cerrar()">
        Entendido
      </button>
    </div>
  `
})
export class NegocioCerradoDialogComponent {
  dialogRef = inject(MatDialogRef<NegocioCerradoDialogComponent>);
  cerrar() {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-perfil-no-creado-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, RouterModule],
  template: `
    <div style="padding: 32px 24px; text-align: center; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);">
      <div style="display: flex; justify-content: center; margin-bottom: 16px;">
        <div style="background-color: #f3f4f6; border-radius: 50%; padding: 16px; display: inline-flex;">
          <mat-icon style="font-size: 40px; height: 40px; width: 40px; color: #9ca3af;">visibility_off</mat-icon>
        </div>
      </div>
      <h2 style="margin: 0 0 12px; font-weight: 700; font-size: 1.5rem; color: #1f2937;">Perfil No Disponible</h2>
      <p style="color: #4b5563; margin: 0 0 24px; font-size: 1.05rem; line-height: 1.5;">
        Este negocio aún no ha creado su Perfil Profesional en nuestra plataforma.
      </p>
      
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <button mat-stroked-button color="primary" style="width: 100%; padding: 8px 0; border-radius: 8px; font-size: 1rem; font-weight: 600;" (click)="cerrar()" [routerLink]="['/reclamar', data.negocioId]">
          <mat-icon>storefront</mat-icon> ¿Eres el dueño? Reclamar
        </button>
        <button mat-flat-button color="primary" style="width: 100%; padding: 8px 0; border-radius: 8px; font-size: 1rem; font-weight: 600;" (click)="cerrar()">
          Entendido
        </button>
      </div>
    </div>
  `
})
export class PerfilNoCreadoDialogComponent {
  dialogRef = inject(MatDialogRef<PerfilNoCreadoDialogComponent>);
  public data = inject(MAT_DIALOG_DATA);
  cerrar() {
    this.dialogRef.close();
  }
}

