import { Component, signal } from '@angular/core';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-pwa-install',
  imports: [MatIcon],
  templateUrl: './pwa-install.component.html',
  styleUrl: './pwa-install.component.css'
})
export class PwaInstallComponent {

  public mostrarPrompt = signal(false);
  private deferredPrompt: any;

  constructor() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.mostrarPrompt.set(true);
    });
  }

  public async instalar() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      if (outcome === 'accepted') this.mostrarPrompt.set(false);
    }
  }

}
