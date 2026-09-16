import { Component, Input, ElementRef, ViewChild, AfterViewInit, inject, DestroyRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InteresPublicidadDialogComponent } from '../interes-publicidad-dialog/interes-publicidad-dialog.component';

export interface BannerInterface {
  id?: string;
  image: string;
  whatsapp?: number;
  phoneFijo?: number;
  patrocinador?: string;
  fechaCaducidad?: string;
}

@Component({
  selector: 'app-carrusel',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './carrusel.component.html',
  styleUrl: './carrusel.component.css'
})
export class CarruselComponent implements AfterViewInit {  

  @Input() conector: BannerInterface[] = [];
  @Input() categoriaId: string = ''; // Recibe la categoría desde el padre
  @ViewChild('carouselContainer') carouselContainer!: ElementRef<HTMLElement>;
  
  private destroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);

  openInterestDialog(index: number) {
    this.dialog.open(InteresPublicidadDialogComponent, {
      data: {
        categoria: this.categoriaId || 'General',
        espacio: `Tarjeta ${index + 1}`
      },
      width: '90%',
      maxWidth: '450px',
      panelClass: 'dark-dialog'
    });
  }

  ngAfterViewInit(): void {
    // Autoplay nativo para reemplazar a swiper JS
    const interval = setInterval(() => {
      if (!this.carouselContainer) return;
      const el = this.carouselContainer.nativeElement;
      const maxScroll = el.scrollWidth - el.clientWidth;
      
      if (el.scrollLeft >= maxScroll - 10) {
        // Volver al inicio
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Avanzar el ancho aproximado de una tarjeta + gap
        const scrollAmount = el.clientWidth * 0.85 + 16; 
        el.scrollTo({ left: el.scrollLeft + scrollAmount, behavior: 'smooth' });
      }
    }, 2500); // 2.5 segundos de delay

    this.destroyRef.onDestroy(() => {
      clearInterval(interval);
    });
  }

}
