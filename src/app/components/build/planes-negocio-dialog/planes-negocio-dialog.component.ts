import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

interface Plan {
  id: string;
  nombre: string;
  precio: number;
  moneda: string;
  frecuencia: string;
  destacado: boolean;
  colorHex: string;
  caracteristicas: string[];
}

@Component({
  selector: 'app-planes-negocio-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './planes-negocio-dialog.component.html',
  styleUrl: './planes-negocio-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanesNegocioDialogComponent {

  dialogRef = inject(MatDialogRef<PlanesNegocioDialogComponent>);

  public readonly WHATSAPP_NUMBER = '573242380090';

  public planes: Plan[] = [
    {
      id: 'basico',
      nombre: 'Básico',
      precio: 35000,
      moneda: '$',
      frecuencia: '/ año',
      destacado: false,
      colorHex: '#3b82f6', // blue
      caracteristicas: [
        'Perfil en el directorio',
        'Información de contacto',
        'Ubicación en mapa',
        'Horarios de atención'
      ]
    },
    {
      id: 'premium',
      nombre: 'Premium',
      precio: 65000,
      moneda: '$',
      frecuencia: '/ año',
      destacado: false,
      colorHex: '#10b981', // emerald green
      caracteristicas: [
        'Todo lo del Básico',
        'Logo y Banner personalizado',
        'Galería de fotos (Hasta 5)',
        'Botón directo a WhatsApp'
      ]
    },
    {
      id: 'premium-plus',
      nombre: 'Premium Plus',
      precio: 135000,
      moneda: '$',
      frecuencia: '/ año',
      destacado: true,
      colorHex: '#f59e0b', // amber / gold
      caracteristicas: [
        'Todo lo del Premium',
        'Galería ilimitada',
        'Catálogo de productos',
        'Recepción de pedidos',
        'Posicionamiento Prioritario'
      ]
    }
  ];

  solicitarPlan(plan: Plan) {
    const mensaje = `Hola, soy dueño de negocio y estoy interesado en adquirir el Plan ${plan.nombre} para mi Perfil Profesional.`;
    const url = `https://wa.me/${this.WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
    this.dialogRef.close(true);
  }

  cerrar() {
    this.dialogRef.close();
  }
}
