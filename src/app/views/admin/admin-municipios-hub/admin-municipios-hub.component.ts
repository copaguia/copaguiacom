import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MUNICIPIOS_ANTIOQUIA, MunicipioAntioquia } from '../../../data/municipios-antioquia';
import { httpsCallable } from 'firebase/functions';
import { InstanciaFirebase } from '../../../core/firebase/instancias.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-municipios-hub',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './admin-municipios-hub.component.html',
  styleUrl: './admin-municipios-hub.component.css'
})
export class AdminMunicipiosHubComponent {
  private firebase = inject(InstanciaFirebase);
  private snackBar = inject(MatSnackBar);

  public subregionSeleccionada = signal<string>('Todas');
  public busquedaTexto = signal<string>('');
  
  public readonly subregiones = [
    'Todas', 'Valle de Aburrá', 'Oriente', 'Occidente', 'Suroeste', 
    'Norte', 'Urabá', 'Bajo Cauca', 'Nordeste', 'Magdalena Medio'
  ];

  public displayedColumns: string[] = ['nombre', 'subregion', 'dominio', 'estado', 'acciones'];

  public municipiosFiltrados = computed(() => {
    let filtrados = MUNICIPIOS_ANTIOQUIA;
    const sub = this.subregionSeleccionada();
    const texto = this.busquedaTexto().toLowerCase();

    if (sub !== 'Todas') {
      filtrados = filtrados.filter(m => m.subregion === sub);
    }
    
    if (texto) {
      filtrados = filtrados.filter(m => m.nombre.toLowerCase().includes(texto));
    }
    
    return filtrados;
  });

  public async verificarDominio(municipio: MunicipioAntioquia) {
    if (!municipio.dominioPropuesto) return;
    
    this.snackBar.open(`Verificando disponibilidad de ${municipio.dominioPropuesto}...`, 'OK', { duration: 2000 });
    municipio.estado = 'PROVISIONANDO'; // Estado visual temporal de carga

    try {
      const checkDomain = httpsCallable(this.firebase.functions, 'checkDomainAvailability');
      const res = await checkDomain({ dominio: municipio.dominioPropuesto }) as any;
      
      if (res.data.success && res.data.disponible) {
        this.snackBar.open(`¡Dominio disponible por ${res.data.precio} ${res.data.moneda}!`, 'Excelente', { duration: 4000 });
        municipio.estado = 'PENDIENTE'; // Vuelve a pendiente para poder activar
      } else {
        this.snackBar.open(`El dominio no está disponible.`, 'Cerrar', { duration: 4000 });
        municipio.estado = 'PENDIENTE';
      }
    } catch (error: any) {
      console.error(error);
      this.snackBar.open(`Error: ${error.message}`, 'Cerrar', { duration: 4000 });
      municipio.estado = 'PENDIENTE';
    }
  }

  public async activarDirectorio(municipio: MunicipioAntioquia) {
    if (!confirm(`¿Estás seguro de comprar y activar ${municipio.dominioPropuesto}? Se realizará el cobro en Cloudflare.`)) {
      return;
    }

    this.snackBar.open(`Iniciando Zero-Touch para ${municipio.nombre}...`, 'OK', { duration: 3000 });
    municipio.estado = 'PROVISIONANDO';

    try {
      const provisionar = httpsCallable(this.firebase.functions, 'provisionarNuevoDirectorio');
      
      const res = await provisionar({
        nombreDirectorio: municipio.nombre,
        dominioObjetivo: municipio.dominioPropuesto,
        limitePoligonal: {}, // Aquí deberías pasar el GeoJSON si lo tienes
        modoConexion: 'NUEVO'
      }) as any;

      if (res.data.success) {
        this.snackBar.open(`¡Directorio Activado!`, '¡Genial!', { duration: 5000 });
        municipio.estado = 'ACTIVO';
      }
    } catch (error: any) {
      console.error(error);
      this.snackBar.open(`Error de aprovisionamiento: ${error.message}`, 'Cerrar', { duration: 5000 });
      municipio.estado = 'PENDIENTE';
    }
  }
}
