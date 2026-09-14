import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToolBarPageComponent } from '../tool-bar-page/tool-bar-page.component';
import { NegocioInterface } from '../../../interfaces/negocio-interface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    BuscadorComponent,
    RouterModule
  ],
  standalone: true,
  templateUrl: './categoria-page.component.html',
  styleUrls: ['./categoria-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriaPageComponent implements OnInit {

  private firestore = inject(InstanciaFirebase).firestore;
  private route = inject(ActivatedRoute);

  private destroyRef = inject(DestroyRef);
  private unsubscribeSnapshot: (() => void) | null = null;

  public title: string = '';
  public categoria: string = '';
  public seccion: string = '';

  public negocios = signal<NegocioInterface[]>([]);
  public negociosFiltrados = signal<NegocioInterface[]>([]);
  public loadingState = signal<LoadingState>(LoadingState.Idle);
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

        this.negocios.set(negocios);
        this.filtrarNegocios(); // Aplica el filtro si el usuario tiene una búsqueda activa
        this.loadingState.set(LoadingState.Success);
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
}
