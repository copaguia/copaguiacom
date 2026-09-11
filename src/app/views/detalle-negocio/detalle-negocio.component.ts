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
        this.calcularEstadoHorario(data.horarios);
        this.analitica.registrarEvento(data.id, 'visita');
      }
    } catch (error) {
      console.error('Error loading business:', error);
    }
    this.loading.set(false);
  }

  public estadoNegocio = signal<string>('');

  public categoriasCatalogo = computed(() => {
    const items = this.negocio()?.catalogo || [];
    return [...new Set(items.map((i: any) => i.categoriaItem))];
  });

  public filtrarPorCat(categoria: string) {
    return this.negocio()?.catalogo?.filter((i: any) => i.categoriaItem === categoria) || [];
  }

  private calcularEstadoHorario(horarios: any) {
    if (!horarios) {
      this.estadoNegocio.set('');
      return;
    }
    
    const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const now = new Date();
    const diaActual = dias[now.getDay()];
    const horarioHoy = horarios[diaActual];

    if (!horarioHoy || !horarioHoy.abierto || !horarioHoy.apertura || !horarioHoy.cierre) {
      this.estadoNegocio.set('Cerrado');
      return;
    }

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const aperturaParts = horarioHoy.apertura.split(':');
    const cierreParts = horarioHoy.cierre.split(':');
    
    if (aperturaParts.length !== 2 || cierreParts.length !== 2) {
      this.estadoNegocio.set('');
      return;
    }

    const aperturaMin = parseInt(aperturaParts[0]) * 60 + parseInt(aperturaParts[1]);
    const cierreMin = parseInt(cierreParts[0]) * 60 + parseInt(cierreParts[1]);

    if (currentMinutes < aperturaMin) {
      if (aperturaMin - currentMinutes <= 60) {
        this.estadoNegocio.set('Abre pronto');
      } else {
        this.estadoNegocio.set('Cerrado');
      }
    } else if (currentMinutes >= aperturaMin && currentMinutes < cierreMin) {
      if (cierreMin - currentMinutes <= 60) {
        this.estadoNegocio.set('Cierra pronto');
      } else {
        this.estadoNegocio.set('Abierto');
      }
    } else {
      this.estadoNegocio.set('Cerrado');
    }
  }
}
