import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { StateEnum } from '../../../enums/state.enum';
import { DistPromotionsService } from '../../../core/firebase/firestore/dist-promotions.service.service';
import { PromocionesInterface } from '../../../interfaces/promociones-interface';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-admin-promociones',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,  MatButtonModule,  MatDatepickerModule,  MatNativeDateModule,  MatIconModule],
  templateUrl: './admin-promociones.component.html',
  styleUrl: './admin-promociones.component.css'
})
export class AdminPromocionesComponent {

  private formBuilder      = inject(FormBuilder);
  private distService      = inject(DistPromotionsService);

  public estado            = signal<StateEnum>(StateEnum.INICIAL);
  public formGroup         : FormGroup;

  constructor() {
    this.formGroup         = this.formBuilder.group({
      titulo               : ['', [Validators.required, Validators.minLength(5)]],
      cuerpo               : ['', [Validators.required, Validators.maxLength(150)]],
      fechaExpiracion      : [null, Validators.required],
      valorDescuento       : [15000, Validators.required]
    });
  }

  async enviarPromocion(): Promise<void> {
    if (this.formGroup.invalid) return;

    this.estado.set(StateEnum.PROCESANDO);

    const valores          = this.formGroup.value;
    const nuevaPromo: PromocionesInterface = {
      titulo               : valores.titulo,
      cuerpo               : valores.cuerpo,
      fecha                : Timestamp.now(),
      expira               : Timestamp.fromDate(valores.fechaExpiracion),
      estado               : StateEnum.PENDIENTE_RED,
      tipo                 : 'PROMO_COPAGUIA',
      valorDescuento       : valores.valorDescuento
    };

    try {
      await this.distService.distribuirPromocionMasiva(nuevaPromo);
      this.estado.set(StateEnum.EXITO);
      this.formGroup.reset({ valorDescuento: 15000 });
    } catch (error) {
      this.estado.set(StateEnum.ERROR);
    }
  }

}
