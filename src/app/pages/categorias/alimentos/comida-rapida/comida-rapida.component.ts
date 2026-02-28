import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ToolBarPageComponent } from '../../../../components/tool-bar-page/tool-bar-page.component';
import { NegocioInterface } from '../../../../interfaces/negocio-interface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InstanciaFirebase } from '../../../../core/firebase/instancias.service';

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
export class ComidaRapidaComponent implements OnInit {

  private firestore = inject(InstanciaFirebase).firestore;


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
    
  }

  buscarNegocios() {
  
}

}