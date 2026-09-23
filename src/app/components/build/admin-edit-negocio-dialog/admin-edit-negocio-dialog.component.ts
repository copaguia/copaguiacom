import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { NegocioInterface } from '../../../interfaces/negocio-interface';
import { NegociosService } from '../../../core/services/negocios.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    MatTabsModule,
    MatIconModule
  ],
  styles: [`
    .edit-dialog-container { background: #1e1e1e; color: #ffffff; border-radius: 16px; padding: 16px 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .dialog-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px; }
    .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 12px; }
    .full-width { grid-column: 1 / -1; }
    .horarios-grid { display: grid; grid-template-columns: 100px 100px 1fr 1fr; gap: 8px; align-items: center; margin-bottom: 8px; }
    .dialog-content-scroll { max-height: 70vh; overflow-y: auto; padding: 12px 4px !important; }
    @media (max-width: 600px) {
      .form-grid { grid-template-columns: 1fr; }
      .horarios-grid { grid-template-columns: 1fr 1fr; }
    }
  `],
  template: `
    <div class="edit-dialog-container">
      <div class="dialog-header" mat-dialog-title>
        <h2 style="margin: 0; display: flex; align-items: center; gap: 8px; color: #fff;">
          <mat-icon color="primary">edit_note</mat-icon>
          Editar Propiedades de Negocio
        </h2>
        <button mat-icon-button mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>

    <mat-dialog-content class="dialog-content-scroll">
      <form [formGroup]="formulario">
        <mat-tab-group animationDuration="0ms">

          <mat-tab label="General">
            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>Nombre del Negocio</mat-label>
                <input matInput formControlName="nombre" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Slug (Ruta URL)</mat-label>
                <input matInput formControlName="slug" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Categoría</mat-label>
                <mat-select formControlName="categoria">
                  @for (cat of categoriasDisponibles; track cat) {
                    <mat-option [value]="cat">{{ cat }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Sección / Subcategoría</mat-label>
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

              <mat-form-field appearance="outline">
                <mat-label>Zonas Asignadas (Directorios)</mat-label>
                <mat-select formControlName="zonasAsignadas" multiple>
                  <mat-option value="copaguia">Copaguia</mat-option>
                  <mat-option value="niquia">Niquia</mat-option>
                  <mat-option value="elhueco">El Hueco Online</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </mat-tab>

          <mat-tab label="Plan & Métricas">
            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>Plan del Negocio</mat-label>
                <mat-select formControlName="plan">
                  <mat-option value="basico">Básico</mat-option>
                  <mat-option value="premium">Premium</mat-option>
                  <mat-option value="plus Premium">Plus Premium</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Rating</mat-label>
                <input matInput type="number" formControlName="rating" step="0.1" min="0" max="5" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Total Reseñas</mat-label>
                <input matInput type="number" formControlName="totalResenas" min="0" />
              </mat-form-field>

              <div style="display: flex; gap: 16px; align-items: center;">
                <mat-checkbox formControlName="verificado" color="primary">Verificado</mat-checkbox>
                <mat-checkbox formControlName="destacado" color="primary">Destacado</mat-checkbox>
              </div>
            </div>
          </mat-tab>

          <mat-tab label="Multimedia">
            <div class="form-grid">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Imagen de Portada (URL)</mat-label>
                <input matInput formControlName="imagen" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Logo (URL)</mat-label>
                <input matInput formControlName="logo" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Banner (URL)</mat-label>
                <input matInput formControlName="banner" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Galería (URLs separadas por comas)</mat-label>
                <textarea matInput formControlName="galeriaTexto" rows="3" placeholder="https://..., https://..."></textarea>
              </mat-form-field>
            </div>
          </mat-tab>

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

          <mat-tab label="Contacto & Redes">
            <div class="form-grid" formGroupName="contacto">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Dirección de Contacto</mat-label>
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
                <mat-label>Correo Electrónico</mat-label>
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
                  <mat-label>Sitio Web</mat-label>
                  <input matInput formControlName="web" />
                </mat-form-field>
              </div>
            </div>
          </mat-tab>

          <mat-tab label="Horarios">
            <div style="margin-top: 12px;" formGroupName="horarios">
              @for (dia of diasSemana; track dia.clave) {
                <div class="horarios-grid" [formGroupName]="dia.clave">
                  <strong style="text-transform: capitalize;">{{ dia.etiqueta }}</strong>
                  <mat-checkbox formControlName="abierto" color="primary">Abierto</mat-checkbox>
                  <mat-form-field appearance="outline" subscriptSizing="dynamic">
                    <mat-label>Apertura</mat-label>
                    <input matInput type="time" formControlName="apertura" />
                  </mat-form-field>
                  <mat-form-field appearance="outline" subscriptSizing="dynamic">
                    <mat-label>Cierre</mat-label>
                    <input matInput type="time" formControlName="cierre" />
                  </mat-form-field>
                </div>
              }
            </div>
          </mat-tab>

          <mat-tab label="Pedidos">
            <div class="form-grid" formGroupName="configuracionPedido">
              <mat-checkbox formControlName="aceptaPedidos" color="primary" class="full-width">
                Habilitar Recepción de Pedidos
              </mat-checkbox>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Mensaje de Bienvenida</mat-label>
                <input matInput formControlName="mensajeBienvenida" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Costo de Domicilio</mat-label>
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

    <mat-dialog-actions align="end" style="gap: 8px;">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" [disabled]="formulario.invalid || guardando()" (click)="guardar()">
        <mat-icon>save</mat-icon>
        {{ guardando() ? 'Guardando...' : 'Guardar Cambios' }}
      </button>
    </mat-dialog-actions>
    </div>
  `
})
export class AdminEditNegocioDialogComponent {
  private fb = inject(FormBuilder);
  private negociosService = inject(NegociosService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<AdminEditNegocioDialogComponent>);
  public data: { negocio: NegocioInterface } = inject(MAT_DIALOG_DATA);

  public guardando = signal<boolean>(false);

  public categoriasDisponibles = [
    'Alimentos', 'Comercios', 'Servicios', 'Entretenimiento', 'Salud',
    'Comunidad', 'Oportunidades', 'Inmuebles', 'Educación', 'Pasatiempos', 'Noticias'
  ];

  public diasSemana = [
    { clave: 'lunes', etiqueta: 'Lunes' },
    { clave: 'martes', etiqueta: 'Martes' },
    { clave: 'miercoles', etiqueta: 'Miércoles' },
    { clave: 'jueves', etiqueta: 'Jueves' },
    { clave: 'viernes', etiqueta: 'Viernes' },
    { clave: 'sabado', etiqueta: 'Sábado' },
    { clave: 'domingo', etiqueta: 'Domingo' },
    { clave: 'festivos', etiqueta: 'Festivos' }
  ];

  public formulario: FormGroup = this.inicializarFormulario();

  private inicializarFormulario(): FormGroup {
    const n = this.data.negocio;
    return this.fb.group({
      nombre: [n.nombre || '', [Validators.required]],
      slug: [n.slug || '', [Validators.required]],
      categoria: [n.categoria || 'Comercios', [Validators.required]],
      seccion: [n.seccion || ''],
      descripcion: [n.descripcion || ''],
      duenoId: [n.duenoId || ''],
      zonasAsignadas: [n.zonasAsignadas || (n.zonaAsignada ? [n.zonaAsignada] : [])],
      plan: [n.plan || 'basico'],
      verificado: [Boolean(n.verificado)],
      destacado: [Boolean(n.destacado)],
      rating: [n.rating ?? 0],
      totalResenas: [n.totalResenas ?? 0],
      imagen: [n.imagen || ''],
      logo: [n.logo || ''],
      banner: [n.banner || ''],
      galeriaTexto: [Array.isArray(n.galeria) ? n.galeria.join(', ') : ''],
      ubicacion: this.fb.group({
        direccion: [n.ubicacion?.direccion || ''],
        barrio: [n.ubicacion?.barrio || ''],
        ciudad: [n.ubicacion?.ciudad || ''],
        latitud: [n.ubicacion?.latitud ?? 0],
        longitud: [n.ubicacion?.longitud ?? 0],
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
      horarios: this.fb.group({
        lunes: this.fb.group({ abierto: [Boolean(n.horarios?.lunes?.abierto)], apertura: [n.horarios?.lunes?.apertura || '08:00'], cierre: [n.horarios?.lunes?.cierre || '18:00'] }),
        martes: this.fb.group({ abierto: [Boolean(n.horarios?.martes?.abierto)], apertura: [n.horarios?.martes?.apertura || '08:00'], cierre: [n.horarios?.martes?.cierre || '18:00'] }),
        miercoles: this.fb.group({ abierto: [Boolean(n.horarios?.miercoles?.abierto)], apertura: [n.horarios?.miercoles?.apertura || '08:00'], cierre: [n.horarios?.miercoles?.cierre || '18:00'] }),
        jueves: this.fb.group({ abierto: [Boolean(n.horarios?.jueves?.abierto)], apertura: [n.horarios?.jueves?.apertura || '08:00'], cierre: [n.horarios?.jueves?.cierre || '18:00'] }),
        viernes: this.fb.group({ abierto: [Boolean(n.horarios?.viernes?.abierto)], apertura: [n.horarios?.viernes?.apertura || '08:00'], cierre: [n.horarios?.viernes?.cierre || '18:00'] }),
        sabado: this.fb.group({ abierto: [Boolean(n.horarios?.sabado?.abierto)], apertura: [n.horarios?.sabado?.apertura || '08:00'], cierre: [n.horarios?.sabado?.cierre || '18:00'] }),
        domingo: this.fb.group({ abierto: [Boolean(n.horarios?.domingo?.abierto)], apertura: [n.horarios?.domingo?.apertura || '08:00'], cierre: [n.horarios?.domingo?.cierre || '18:00'] }),
        festivos: this.fb.group({ abierto: [Boolean(n.horarios?.festivos?.abierto)], apertura: [n.horarios?.festivos?.apertura || '08:00'], cierre: [n.horarios?.festivos?.cierre || '18:00'] })
      }),
      configuracionPedido: this.fb.group({
        aceptaPedidos: [Boolean(n.configuracionPedido?.aceptaPedidos)],
        mensajeBienvenida: [n.configuracionPedido?.mensajeBienvenida || ''],
        costoDomicilio: [n.configuracionPedido?.costoDomicilio ?? 0],
        pedidoMinimo: [n.configuracionPedido?.pedidoMinimo ?? 0]
      })
    });
  }

  public async guardar(): Promise<void> {
    if (this.formulario.invalid) return;
    this.guardando.set(true);
    try {
      const v = this.formulario.value;
      const galeria = v.galeriaTexto
        ? (v.galeriaTexto as string).split(',').map((url: string) => url.trim()).filter((url: string) => url.length > 0)
        : [];

      const datosActualizados: Partial<NegocioInterface> = {
        nombre: v.nombre,
        slug: v.slug,
        categoria: v.categoria,
        seccion: v.seccion,
        descripcion: v.descripcion,
        duenoId: v.duenoId,
        zonasAsignadas: v.zonasAsignadas,
        plan: v.plan,
        verificado: v.verificado,
        destacado: v.destacado,
        rating: Number(v.rating),
        totalResenas: Number(v.totalResenas),
        imagen: v.imagen,
        logo: v.logo,
        banner: v.banner,
        galeria,
        ubicacion: v.ubicacion,
        contacto: v.contacto,
        horarios: v.horarios,
        configuracionPedido: v.configuracionPedido
      };

      await this.negociosService.actualizarNegocio(this.data.negocio.id, datosActualizados);
      this.snackBar.open('Propiedades de negocio actualizadas con éxito.', 'Cerrar', { duration: 3000 });
      this.dialogRef.close(true);
    } catch (error) {
      this.snackBar.open('Error al actualizar las propiedades del negocio.', 'Cerrar', { duration: 4000 });
    } finally {
      this.guardando.set(false);
    }
  }
}
