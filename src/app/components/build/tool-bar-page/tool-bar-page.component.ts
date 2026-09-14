import { CommonModule, Location } from '@angular/common';
import { Component, Input, inject, signal, effect } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InteresPublicidadDialogComponent } from '../interes-publicidad-dialog/interes-publicidad-dialog.component';
import { ToolbarAdDialogComponent } from '../toolbar-ad-dialog/toolbar-ad-dialog.component';
import { PublicidadService } from '../../../core/services/publicidad.service';
import { BannerInterface } from '../carrusel/carrusel.component';

@Component({
  selector: 'app-tool-bar-page',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './tool-bar-page.component.html',
  styleUrl: './tool-bar-page.component.css'
})
export class ToolBarPageComponent {
  private _title: string = '';
  @Input() 
  set title(value: string) {
    this._title = value;
    this.cargarToolbarAd(value);
  }
  get title(): string {
    return this._title;
  }

  @Input() count: number | null = null;

  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() buttonClass: string = '';
  @Input() showIcon: boolean = true;
  @Input() icon: string = 'arrow_back';

  dialog = inject(MatDialog);
  publicidadService = inject(PublicidadService);
  
  toolbarAd = signal<BannerInterface | null>(null);

  constructor(private location: Location) {}

  async cargarToolbarAd(categoria: string) {
    if (!categoria) return;
    const ad = await this.publicidadService.obtenerToolbarAd(categoria);
    // Verificar si realmente tiene imagen/patrocinador activo
    if (ad && ad.image) {
      this.toolbarAd.set(ad);
    } else {
      this.toolbarAd.set(null);
    }
  }

  goBack(): void {
    this.location.back();
  }

  openPromoDialog(): void {
    const ad = this.toolbarAd();
    if (ad) {
      this.dialog.open(ToolbarAdDialogComponent, {
        data: ad,
        width: '90%',
        maxWidth: '400px',
        panelClass: 'dark-dialog'
      });
    } else {
      this.dialog.open(InteresPublicidadDialogComponent, {
        data: { categoria: this.title || 'General', espacio: 'Toolbar ADS' },
        width: '90%',
        maxWidth: '400px',
        panelClass: 'dark-dialog'
      });
    }
  }
}
