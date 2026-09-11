import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { AnaliticaService } from '../../core/husky/analitica.service.service';
import { NegocioInterface } from '../../interfaces/negocio-interface';
import { InstanciaFirebase } from '../../core/firebase/instancias.service';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { ToolBarPageComponent } from '../../components/build/tool-bar-page/tool-bar-page.component';

@Component({
  selector: 'app-detalle-negocio',
  imports: [CommonModule, MatTabsModule, MatIconModule, MatButtonModule, MatChipsModule, MatProgressSpinnerModule, ToolBarPageComponent],
  standalone: true,
  templateUrl: './detalle-negocio.component.html',
  styleUrl: './detalle-negocio.component.css'
})
export class DetalleNegocioComponent implements OnInit {

  private analitica = inject(AnaliticaService);
  private route = inject(ActivatedRoute);
  private firestore = inject(InstanciaFirebase).firestore;
  
  public negocio = signal<NegocioInterface | null>(null);
  public loading = signal<boolean>(true);

  async ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      const slug = params.get('slug');
      if (slug) {
        await this.cargarNegocio(slug);
      }
    });
  }

  async cargarNegocio(slug: string) {
    this.loading.set(true);
    try {
      const q = query(collection(this.firestore, 'negocios'), where('slug', '==', slug));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data() as NegocioInterface;
        data.id = querySnapshot.docs[0].id;
        this.negocio.set(data);
        this.analitica.registrarEvento(data.id, 'visita');
      }
    } catch (error) {
      console.error('Error loading business:', error);
    }
    this.loading.set(false);
  }

  public categoriasCatalogo = computed(() => {
    const items = this.negocio()?.catalogo || [];
    return [...new Set(items.map((i: any) => i.categoriaItem))];
  });

  public filtrarPorCat(categoria: string) {
    return this.negocio()?.catalogo?.filter((i: any) => i.categoriaItem === categoria) || [];
  }
}
