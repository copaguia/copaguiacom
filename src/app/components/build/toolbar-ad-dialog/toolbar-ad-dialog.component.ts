import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BannerInterface } from '../carrusel/carrusel.component';

@Component({
  selector: 'app-toolbar-ad-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './toolbar-ad-dialog.component.html',
  styleUrl: './toolbar-ad-dialog.component.css'
})
export class ToolbarAdDialogComponent {
  
  constructor(
    public dialogRef: MatDialogRef<ToolbarAdDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BannerInterface
  ) {}

  contactarPatrocinador() {
    if (this.data.whatsapp) {
      const mensaje = `Hola, los vi en Copaguía y me gustaría más información.`;
      const url = `https://wa.me/57${this.data.whatsapp}?text=${encodeURIComponent(mensaje)}`;
      window.open(url, '_blank');
    }
  }

  cerrar() {
    this.dialogRef.close();
  }
}
