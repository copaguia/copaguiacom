import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ToolBarPageComponent } from '../tool-bar-page/tool-bar-page.component';
import { NegocioInterface } from '../../../interfaces/negocio-interface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InstanciaFirebase } from '../../../core/firebase/instancias.service';
import { collection, getDocs, query, where, DocumentData } from 'firebase/firestore';
import { CommonModule } from '@angular/common';

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
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  standalone: true,
  templateUrl: './categoria-page.component.html',
  styleUrls: ['./categoria-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriaPageComponent implements OnInit {

  private firestore = inject(InstanciaFirebase).firestore;
  private route = inject(ActivatedRoute);

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

  async buscarNegocios() {
    if (!this.categoria) return;

    this.loadingState.set(LoadingState.Loading);
    this.error.set(null);

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

      const querySnapshot = await getDocs(q);
      const negocios = querySnapshot.docs.map(doc => {
        const data = doc.data() as DocumentData;
        return { id: doc.id, ...data } as NegocioInterface;
      });
      this.negocios.set(negocios);
      this.negociosFiltrados.set(negocios);
      this.loadingState.set(LoadingState.Success);
    } catch (e) {
      console.error(e);
      this.error.set('Error al buscar negocios');
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
}
