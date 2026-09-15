import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { NegocioInterface } from '../../../interfaces/negocio-interface';
import { NegociosService } from '../../../core/services/negocios.service';
import { SnackbarService } from '../../../core/services/snackbar.service';

@Component({
  selector: 'app-admin-edit-negocio-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTabsModule
  ],
  styles: [`
    .dialog-container-dark {
      background-color: #121212;
      color: #ffffff;
      padding: 16px;
      border-radius: 8px;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 16px;
    }
    .full-width {
      grid-column: 1 / -1;
    }
    ::ng-deep .mat-mdc-tab-body-content {
      padding: 16px 0;
    }
    ::ng-deep .mat-mdc-dialog-surface {
      background-color: #121212 !important;
      color: #ffffff !important;
    }
  `],
  template: `
    <div class="dialog-container-dark">
      <h2 mat-dialog-title style="color: white; margin-bottom: 0;">Editar Negocio (Admin)</h2>
      <mat-dialog-content>
        <form [formGroup]="editForm">
          <mat-tab-group animationDuration="0ms">
            <!-- PESTAÑA: GENERAL -->
            <mat-tab label="General">
              <div class="form-grid">
                <mat-form-field appearance="outline">
                  <mat-label>Nombre</mat-label>
                  <input matInput formControlName="nombre" />
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Slug</mat-label>
                  <input matInput formControlName="slug" />
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Categoría</mat-label>
                  <mat-select formControlName="categoria">
                    <mat-option value="Alimentos">Alimentos</mat-option>
                    <mat-option value="Comercios">Comercios</mat-option>
                    <mat-option value="Servicios">Servicios</mat-option>
                    <mat-option value="Entretenimiento">Entretenimiento</mat-option>
                    <mat-option value="Salud">Salud</mat-option>
                    <mat-option value="Comunidad">Comunidad</mat-option>
                    <mat-option value="Oportunidades">Oportunidades</mat-option>
                    <mat-option value="Inmuebles">Inmuebles</mat-option>
                    <mat-option value="Educación">Educación</mat-option>
                    <mat-option value="Pasatiempos">Pasatiempos</mat-option>
                    <mat-option value="Noticias">Noticias</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Sección</mat-label>
                  <input matInput formControlName="seccion" />
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Descripción</mat-label>
                  <textarea matInput formControlName="descripcion" rows="3"></textarea>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>ID Dueño</mat-label>
                  <input matInput formControlName="duenoId" />
                </mat-form-field>
              </div>
            </mat-tab>

            <!-- PESTAÑA: ESTADOS Y MÉTRICAS -->
            <mat-tab label="Estados & Info">
              <div class="form-grid">
                <mat-form-field appearance="outline">
                  <mat-label>Plan</mat-label>
                  <mat-select formControlName="plan">
                    <mat-option value="basico">Básico</mat-option>
                    <mat-option value="premium">Premium</mat-option>
                    <mat-option value="plus Premium">Plus Premium</mat-option>
                  </mat-select>
                </mat-form-field>
                
                <mat-form-field appearance="outline">
                  <mat-label>Rating</mat-label>
                  <input matInput type="number" formControlName="rating" />
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Total Reseñas</mat-label>
                  <input matInput type="number" formControlName="totalResenas" />
                </mat-form-field>

                <mat-checkbox formControlName="verificado" color="primary">Verificado</mat-checkbox>
                <mat-checkbox formControlName="destacado" color="primary">Destacado</mat-checkbox>
              </div>
            </mat-tab>

            <!-- PESTAÑA: IMÁGENES -->
            <mat-tab label="Imágenes">
              <div class="form-grid">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Logo (URL)</mat-label>
                  <input matInput formControlName="logo" />
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Banner (URL)</mat-label>
                  <input matInput formControlName="banner" />
                </mat-form-field>
              </div>
            </mat-tab>

            <!-- PESTAÑA: UBICACIÓN -->
            <mat-tab label="Ubicación">
              <div class="form-grid" formGroupName="ubicacion">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Dirección</mat-label>
                  <input matInput formControlName="direccion" />
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Barrio</mat-label>
                  <input matInput formControlName="barrio" />
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Ciudad</mat-label>
                  <input matInput formControlName="ciudad" />
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Latitud</mat-label>
                  <input matInput type="number" formControlName="latitud" />
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Longitud</mat-label>
                  <input matInput type="number" formControlName="longitud" />
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Google Maps URL</mat-label>
                  <input matInput formControlName="googleMapsUrl" />
                </mat-form-field>
              </div>
            </mat-tab>

            <!-- PESTAÑA: CONTACTO -->
            <mat-tab label="Contacto">
              <div class="form-grid" formGroupName="contacto">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Dirección (Contacto)</mat-label>
                  <input matInput formControlName="direccion" />
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>WhatsApp</mat-label>
                  <input matInput formControlName="whatsapp" />
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Teléfono</mat-label>
                  <input matInput formControlName="telefono" />
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Email</mat-label>
                  <input matInput formControlName="email" />
                </mat-form-field>

                <div formGroupName="redes" class="form-grid full-width" style="margin-top: 0;">
                  <mat-form-field appearance="outline">
                    <mat-label>Instagram</mat-label>
                    <input matInput formControlName="instagram" />
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Facebook</mat-label>
                    <input matInput formControlName="facebook" />
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>TikTok</mat-label>
                    <input matInput formControlName="tiktok" />
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Web</mat-label>
                    <input matInput formControlName="web" />
                  </mat-form-field>
                </div>
              </div>
            </mat-tab>

            <!-- PESTAÑA: PEDIDOS -->
            <mat-tab label="Pedidos">
              <div class="form-grid" formGroupName="configuracionPedido">
                <mat-checkbox formControlName="aceptaPedidos" color="primary" class="full-width">Acepta Pedidos</mat-checkbox>
                
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Mensaje Bienvenida</mat-label>
                  <input matInput formControlName="mensajeBienvenida" />
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Costo Domicilio</mat-label>
                  <input matInput type="number" formControlName="costoDomicilio" />
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Pedido Mínimo</mat-label>
                  <input matInput type="number" formControlName="pedidoMinimo" />
                </mat-form-field>
              </div>
            </mat-tab>
          </mat-tab-group>
        </form>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close style="color: white;">Cancelar</button>
        <button mat-flat-button color="primary" [disabled]="editForm.invalid || isSaving" (click)="guardar()">
          {{ isSaving ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
      </mat-dialog-actions>
    </div>
  `
})
export class AdminEditNegocioDialogComponent implements OnInit {
  public editForm!: FormGroup;
  public isSaving = false;

  private fb = inject(FormBuilder);
  private negociosService = inject(NegociosService);
  private snackbar = inject(SnackbarService);
  private dialogRef = inject(MatDialogRef<AdminEditNegocioDialogComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { negocio: NegocioInterface }) { }

  ngOnInit(): void {
    const n = this.data.negocio;

    this.editForm = this.fb.group({
      nombre: [n.nombre, Validators.required],
      slug: [n.slug, Validators.required],
      categoria: [n.categoria, Validators.required],
      seccion: [n.seccion],
      descripcion: [n.descripcion],
      duenoId: [n.duenoId],

      plan: [n.plan || 'basico'],
      rating: [n.rating || 0],
      totalResenas: [n.totalResenas || 0],
      verificado: [n.verificado || false],
      destacado: [n.destacado || false],

      logo: [n.logo],
      banner: [n.banner],

      ubicacion: this.fb.group({
        direccion: [n.ubicacion?.direccion || ''],
        barrio: [n.ubicacion?.barrio || ''],
        ciudad: [n.ubicacion?.ciudad || ''],
        latitud: [n.ubicacion?.latitud || 0],
        longitud: [n.ubicacion?.longitud || 0],
        googleMapsUrl: [n.ubicacion?.googleMapsUrl || '']
      }),

      contacto: this.fb.group({
        direccion: [n.contacto?.direccion || ''],
        whatsapp: [n.contacto?.whatsapp || ''],
        telefono: [n.contacto?.telefono || ''],
        email: [n.contacto?.email || ''],
        redes: this.fb.group({
          instagram: [n.contacto?.redes?.instagram || ''],
          facebook: [n.contacto?.redes?.facebook || ''],
          tiktok: [n.contacto?.redes?.tiktok || ''],
          web: [n.contacto?.redes?.web || '']
        })
      }),

      configuracionPedido: this.fb.group({
        aceptaPedidos: [n.configuracionPedido?.aceptaPedidos || false],
        mensajeBienvenida: [n.configuracionPedido?.mensajeBienvenida || ''],
        costoDomicilio: [n.configuracionPedido?.costoDomicilio || 0],
        pedidoMinimo: [n.configuracionPedido?.pedidoMinimo || 0]
      })
    });
  }

  async guardar(): Promise<void> {
    if (this.editForm.invalid) return;

    this.isSaving = true;
    try {
      const formValue = this.editForm.value;

      const esPremium = formValue.plan === 'premium' || formValue.plan === 'plus Premium';

      const updateData: Partial<NegocioInterface> = {
        nombre: formValue.nombre,
        slug: formValue.slug,
        categoria: formValue.categoria,
        seccion: formValue.seccion,
        descripcion: formValue.descripcion,
        duenoId: formValue.duenoId,

        plan: formValue.plan,
        premium: esPremium,
        rating: formValue.rating,
        totalResenas: formValue.totalResenas,
        verificado: formValue.verificado,
        destacado: formValue.destacado,

        logo: formValue.logo,
        banner: formValue.banner,

        ubicacion: formValue.ubicacion,
        contacto: formValue.contacto,
        configuracionPedido: formValue.configuracionPedido
      };

      await this.negociosService.actualizarNegocio(this.data.negocio.id, updateData);
      this.snackbar.mostrar('Negocio actualizado correctamente');
      this.dialogRef.close(true);
    } catch (error) {
      console.error('Error al actualizar negocio', error);
      this.snackbar.mostrar('Error al actualizar negocio');
    } finally {
      this.isSaving = false;
    }
  }
}
