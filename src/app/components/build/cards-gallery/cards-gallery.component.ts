import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PublicidadService } from '../../../core/services/publicidad.service';
import { TenantService } from '../../../core/services/tenant.service';
import { BannerInterface } from '../carrusel/carrusel.component';
import { InteresPublicidadDialogComponent } from '../interes-publicidad-dialog/interes-publicidad-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cards-gallery',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule],
  templateUrl: './cards-gallery.component.html',
  styleUrl: './cards-gallery.component.css',
})
export class CardsGalleryComponent implements OnInit {
  private publicidadService = inject(PublicidadService);
  private tenantService = inject(TenantService);
  private dialog = inject(MatDialog);

  sponsors: BannerInterface[] = [];
  tenantId: string = 'default';

  async ngOnInit() {
    this.tenantId = this.tenantService.currentTenant();
    
    // Obtenemos los banners de patrocinadores para el directorio actual
    const banners = await this.publicidadService.obtenerBanners(this.tenantId);
    this.sponsors = banners.filter(b => b.image);
    
    // Si no hay sponsors locales y estamos en un municipio, mostramos los globales ('default')
    if (this.sponsors.length === 0 && this.tenantId !== 'default') {
      const globalBanners = await this.publicidadService.obtenerBanners('default');
      this.sponsors = globalBanners.filter(b => b.image);
    }

    // Si sigue vacío, agregamos un item para que la marquesina siga rodando con el "Espacio Disponible"
    if (this.sponsors.length === 0) {
      this.sponsors = [
        { id: 'disponible', image: '', patrocinador: 'Espacio Disponible' },
        { id: 'disponible2', image: '', patrocinador: 'Espacio Disponible' },
        { id: 'disponible3', image: '', patrocinador: 'Espacio Disponible' }
      ];
    }
  }

  abrirEnlace(sponsor: BannerInterface) {
    if (sponsor.url) {
      // Si la URL no tiene http/https, se lo agregamos para que no falle el redireccionamiento
      const link = sponsor.url.startsWith('http') ? sponsor.url : `https://${sponsor.url}`;
      window.open(link, '_blank');
    } else if (sponsor.whatsapp) {
      window.open(`https://wa.me/57${sponsor.whatsapp}`, '_blank');
    }
  }

  openInterestDialog() {
    this.dialog.open(InteresPublicidadDialogComponent, {
      data: {
        categoria: this.tenantId === 'default' ? 'Antioquia Central' : this.tenantId,
        espacio: `Marquesina de Patrocinadores (Portal)`
      },
      width: '90%',
      maxWidth: '450px',
      panelClass: 'dark-dialog'
    });
  }
}
