import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BannerInterface } from '../carrusel/carrusel.component';

@Component({
  selector: 'app-oferta-central-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './oferta-central-dialog.component.html',
  styleUrl: './oferta-central-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfertaCentralDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<OfertaCentralDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { banner: BannerInterface }
  ) {}

  cerrar(): void {
    this.dialogRef.close();
  }

  contactarWhatsApp(): void {
    if (this.data.banner.whatsapp) {
      const url = `https://wa.me/${this.data.banner.whatsapp}?text=Hola%20${this.data.banner.patrocinador || ''},%20vi%20su%20oferta%20en%20CopaGuia.com`;
      window.open(url, '_blank');
    } else {
      alert('El anunciante no ha proporcionado un número de WhatsApp para esta oferta.');
    }
  }
}
