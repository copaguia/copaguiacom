import { Injectable, signal, inject, computed } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class TenantService {
  private readonly document = inject(DOCUMENT);

  readonly currentTenant = signal<string>('default');
  readonly isCopaguia = computed(() => this.currentTenant() === 'copaguia');
  readonly isNiquia = computed(() => this.currentTenant() === 'niquia');
  readonly isElHueco = computed(() => this.currentTenant() === 'elhueco');

  constructor() {
    this.detectarTenant();
  }

  private detectarTenant(): void {
    const hostname = this.document.location.hostname;
    
    if (hostname.includes('copaguia.com')) {
      this.currentTenant.set('copaguia');
    } else if (hostname.includes('niquia.com')) {
      this.currentTenant.set('niquia');
    } else if (hostname.includes('elhueco.online')) {
      this.currentTenant.set('elhueco');
    }
  }
}
