import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ToolBarPageComponent } from '../../../../components/tool-bar-page/tool-bar-page.component';
import { NegocioInterface } from '../../../../interfaces/negocio-interface';
import { getDocumentsByField } from '../../../../firebase/firestore';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

enum LoadingState {
  Idle = 'idle',
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}

@Component({
  selector: 'app-comida-rapida',
  imports: [
    ToolBarPageComponent,
    FormsModule, // Añade FormsModule aquí
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  standalone: true,
  templateUrl: './comida-rapida.component.html',
  styleUrl: './comida-rapida.component.css'
})
export class ComidaRapidaComponent {
  public title = 'Comida Rápida';
  public negocios = signal<NegocioInterface[]>([]);
  public negociosFiltrados = signal<NegocioInterface[]>([]);
  public loadingState = signal<LoadingState>(LoadingState.Idle);
  public error = signal<string | null>(null);
  public isLoading = computed(() => this.loadingState() === LoadingState.Loading);
  public terminoBusqueda = signal<string>('');

  public trackByNegocioId(index: number, negocio: NegocioInterface): string {
    return negocio.id;
  }

  async ngOnInit() {
    this.loadingState.set(LoadingState.Loading);
    this.error.set(null);

    try {
      const seccion = this.title;
      const negociosData = await getDocumentsByField<NegocioInterface>('Negocios', 'seccion', seccion);
      this.negocios.set(negociosData);
      this.negociosFiltrados.set(negociosData); // Inicialmente mostramos todos
      this.loadingState.set(LoadingState.Success);
    } catch (error) {
      console.error('Error al obtener los negocios:', error);
      this.error.set('Error al cargar los datos. Por favor, intente más tarde.');
      this.loadingState.set(LoadingState.Error);
    }
  }

  buscarNegocios() {
    const termino = this.terminoBusqueda().toLowerCase().trim();
    
    if (!termino) {
      // Si el término está vacío, mostramos todos los negocios
      this.negociosFiltrados.set(this.negocios());
      return;
    }
    
    // Filtramos los negocios que coincidan con el término de búsqueda
    // Ajusta las propiedades según las que quieras buscar
    const resultados = this.negocios().filter(negocio => 
      negocio.nombre?.toLowerCase().includes(termino) || 
      negocio.descripcion?.toLowerCase().includes(termino) ||
      negocio.tags?.some(tag => tag.toLowerCase().includes(termino))
    );
    
    this.negociosFiltrados.set(resultados);
  }
}