import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CostoAppService } from '../../../../../core/services/costo-app.service';

@Component({
  selector: 'app-costos-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTooltipModule,
    CurrencyPipe
  ],
  templateUrl: './costos-panel.component.html',
  styleUrls: ['./costos-panel.component.css']
})
export class CostosPanelComponent implements OnInit {
  public costoService = inject(CostoAppService);

  ngOnInit() {
    this.costoService.calcularCostosEnTiempoReal();
  }

  recargar() {
    this.costoService.calcularCostosEnTiempoReal();
  }
}
