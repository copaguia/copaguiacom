import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  private http   = inject(HttpClient);
  private workerUrl = 'https://cooaguia-marketplace.lidertech.workers.dev'; //aqui la url del worker para el marketplace, se usara para lecturas de la db.
  
  public productos = signal<any[]>([]);
  public cargando  = signal<boolean>(false);

  public async buscarEnMarketplace(termino: string = '', cat: string = '') {
    this.cargando.set(true);
    const url = `${this.workerUrl}?q=${termino}&categoria=${cat}`;
    
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.productos.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }
  
}
