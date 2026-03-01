import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { BilleteraService } from '../../core/cobol/billetera.service';

@Component({
  selector: 'app-marranito',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressBarModule,
    MatCardModule, MatSnackBarModule
  ],
  templateUrl: './marranito.component.html',
  styleUrl: './marranito.component.css'
})
export class MarranitoComponent implements OnInit {
  // Inyección del servicio de la billetera
  private billeteraService = inject(BilleteraService);
  private snackBar = inject(MatSnackBar); // Inyección del MatSnackBar para notificaciones

  // Formularios
  importInput: string = ''; // Para la frase semilla o clave privada
  sendToAddress: string = ''; // Dirección del destinatario
  sendAmount: number | null = null; // Cantidad a enviar

  // Estados de la UI con Signals
  isLoading: WritableSignal<boolean> = signal(false); // Para mostrar un spinner/barra de progreso
  errorMessage: WritableSignal<string | null> = signal(null);
  successMessage: WritableSignal<string | null> = signal(null);

  // Acceso a las Signals del servicio (solo lectura en el componente, se acceden como funciones)
  walletAddress = this.billeteraService.walletAddress;
  avaxBalance = this.billeteraService.avaxBalance;
  newMnemonic = this.billeteraService.newMnemonic;

  constructor() {}

  ngOnInit(): void {
    // Intentar actualizar saldos al iniciar el componente si ya hay una billetera
    // Esto es útil si el usuario regresa al componente sin recargar la página completamente
    if (this.walletAddress()) {
      this.billeteraService.updateBalances();
    }
  }

  async createWallet(): Promise<void> {
    this.resetMessages();
    this.isLoading.set(true);
    try {
      const { address, mnemonic } = await this.billeteraService.createNewWallet();
      this.successMessage.set(`Billetera creada exitosamente. Guarda tu frase semilla: "${mnemonic}"`);
      this.snackBar.open('Billetera creada y conectada!', 'Cerrar', { duration: 5000 });
      // La frase semilla ya está en newMnemonic Signal en el servicio, accesible via this.newMnemonic()
    } catch (error: any) {
      this.errorMessage.set(`Error al crear billetera: ${error.message}`);
      this.snackBar.open(`Error: ${error.message}`, 'Cerrar', { duration: 5000 });
    } finally {
      this.isLoading.set(false);
    }
  }

  async importWallet(): Promise<void> {
    this.resetMessages();
    this.isLoading.set(true);
    try {
      const success = await this.billeteraService.importWallet(this.importInput);
      if (success) {
        this.successMessage.set('Billetera importada y conectada exitosamente.');
        this.snackBar.open('Billetera importada y conectada!', 'Cerrar', { duration: 5000 });
        this.importInput = ''; // Limpiar el input
      } else {
        this.errorMessage.set('Falló la importación de la billetera. Verifica la frase semilla/clave privada.');
        this.snackBar.open('Error al importar billetera.', 'Cerrar', { duration: 5000 });
      }
    } catch (error: any) {
      this.errorMessage.set(`Error al importar billetera: ${error.message}`);
      this.snackBar.open(`Error: ${error.message}`, 'Cerrar', { duration: 5000 });
    } finally {
      this.isLoading.set(false);
    }
  }

  async sendAvax(): Promise<void> {
    this.resetMessages();
    // Validaciones básicas
    if (!this.sendToAddress || this.sendAmount === null || this.sendAmount <= 0) {
      this.errorMessage.set('Por favor, ingresa una dirección de destinatario y una cantidad válida (mayor que 0).');
      return;
    }

    this.isLoading.set(true);
    try {
      const txHash = await this.billeteraService.sendAvax(this.sendToAddress, this.sendAmount.toString());
      if (txHash) {
        this.successMessage.set(`Transacción enviada! Hash: ${txHash}. Revisando saldo...`);
        this.snackBar.open('Transacción de AVAX enviada!', 'Cerrar', { duration: 5000 });
        // Opcional: limpiar inputs después de enviar
        this.sendToAddress = '';
        this.sendAmount = null;
      }
    } catch (error: any) {
      this.errorMessage.set(`Error al enviar AVAX: ${error.message}`);
      this.snackBar.open(`Error: ${error.message}`, 'Cerrar', { duration: 5000 });
    } finally {
      this.isLoading.set(false);
    }
  }

  disconnectWallet(): void {
    this.billeteraService.disconnectWallet();
    this.resetMessages();
    this.snackBar.open('Billetera desconectada.', 'Cerrar', { duration: 3000 });
  }

  resetMessages(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  // Utilidad para copiar la dirección o frase semilla
  copyToClipboard(text: string | null): void {
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        this.snackBar.open('Copiado al portapapeles!', 'Cerrar', { duration: 2000 });
      }).catch(err => {
        console.error('No se pudo copiar el texto: ', err);
        this.snackBar.open('Error al copiar.', 'Cerrar', { duration: 2000 });
      });
    }
  }
}
