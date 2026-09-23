import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AdminBorradorService } from '../../../core/services/admin-borrador.service';
import { AuthorizationService } from '../../../core/auth/authorization.service';
import { UsuariosService } from '../../../core/firebase/firestore/usuarios.service';
import { NegocioInterface } from '../../../interfaces/negocio-interface';
import { PerfilInterface } from '../../../interfaces/perfil-interface';
import { RankingValidadorInterface, RankingRolInterface } from '../../../interfaces/ranking-validador-interface';

@Component({
  selector: 'app-data-borrador',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule, 
    MatProgressSpinnerModule,
    MatChipsModule,
    MatCardModule,
    MatTabsModule,
    MatListModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule
  ],
  templateUrl: './data-borrador.component.html',
  styleUrls: ['./data-borrador.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataBorradorComponent implements OnInit {
  private adminBorradorService = inject(AdminBorradorService);
  public usuariosService       = inject(UsuariosService);
  private router               = inject(Router);
  private location             = inject(Location);
  public authorization         = inject(AuthorizationService);
  private snackBar             = inject(MatSnackBar);

  public borradores            = signal<NegocioInterface[]>([]);
  public verificados           = signal<NegocioInterface[]>([]);
  public estaCargando          = signal<boolean>(true);
  public pendientes            = signal<number>(0);
  public aprobados             = signal<number>(0);
  public terminoBusqueda       = signal<string>('');
  public vistaRanking          = signal<'usuario' | 'rol'>('usuario');

  public columnasPendientes: string[]     = ['nombre', 'categoria', 'seccion', 'direccion', 'telefono', 'acciones'];
  public columnasVerificados: string[]    = ['nombre', 'categoria', 'seccion', 'direccion', 'telefono', 'validador', 'acciones'];
  public columnasRankingUsuario: string[] = ['posicion', 'validador', 'rol', 'total', 'porcentaje', 'ultimaFecha'];
  public columnasRankingRol: string[]     = ['posicion', 'rol', 'validadores', 'total', 'porcentaje', 'ultimaFecha'];

  public borradoresFiltrados = computed(() => {
    const termino = this.normalizarTexto(this.terminoBusqueda());
    const lista   = this.borradores();
    if (!termino) return lista;
    return lista.filter(item => this.coincideCriterioBusqueda(item, termino));
  });

  public verificadosFiltrados = computed(() => {
    const termino = this.normalizarTexto(this.terminoBusqueda());
    const lista   = this.verificados();
    if (!termino) return lista;
    return lista.filter(item => this.coincideCriterioBusqueda(item, termino));
  });

  public rankingUsuarios = computed<RankingValidadorInterface[]>(() => {
    const listaNegocios = this.verificados();
    const listaUsuarios = this.usuariosService.usuarios();
    if (!listaNegocios || listaNegocios.length === 0) return [];

    const mapaPorUid   = new Map<string, PerfilInterface>();
    const mapaPorEmail = new Map<string, PerfilInterface>();

    for (const u of listaUsuarios) {
      if (u.id) mapaPorUid.set(u.id, u);
      if (u.email) mapaPorEmail.set(u.email.toLowerCase().trim(), u);
    }

    const validadorMap = new Map<string, {
      uid: string;
      nombre: string;
      email: string;
      rol: string;
      total: number;
      ultimaFecha: string;
      urlFoto?: string;
    }>();

    for (const negocio of listaNegocios) {
      const email = (negocio.verificadoPorEmail || '').trim();
      const uid   = (negocio.verificadoPorUid || '').trim();
      const fecha = (negocio.fechaVerificacion || '') as string;
      
      const emailKey = email.toLowerCase();
      const clave    = uid || emailKey || 'sistema';

      const usuario       = uid ? mapaPorUid.get(uid) : (emailKey ? mapaPorEmail.get(emailKey) : undefined);
      const nombreUsuario = usuario?.nombreMostrado || usuario?.nombreUsuario || (email ? email.split('@')[0] : 'Sistema');
      const emailUsuario  = usuario?.email || email || 'sistema@directoriopaisa.com';
      const rolUsuario    = (usuario?.rolUsuario || (clave === 'sistema' ? 'sistema' : 'sin rol')).toLowerCase();
      const foto          = usuario?.urlFoto || undefined;

      const existente = validadorMap.get(clave);
      if (existente) {
        existente.total += 1;
        if (!existente.uid && uid) existente.uid = uid;
        if (!existente.urlFoto && foto) existente.urlFoto = foto;
        if (fecha && (!existente.ultimaFecha || new Date(fecha) > new Date(existente.ultimaFecha))) {
          existente.ultimaFecha = fecha;
        }
      } else {
        validadorMap.set(clave, {
          uid,
          nombre: nombreUsuario,
          email: emailUsuario,
          rol: rolUsuario,
          total: 1,
          ultimaFecha: fecha,
          urlFoto: foto
        });
      }
    }

    const items            = Array.from(validadorMap.values());
    const totalVerificados = items.reduce((sum, item) => sum + item.total, 0) || 1;

    items.sort((a, b) => b.total - a.total);

    return items.map((item, index) => ({
      posicion:    index + 1,
      uid:         item.uid,
      nombre:      item.nombre,
      email:       item.email,
      rol:         item.rol,
      total:       item.total,
      porcentaje:  Math.round((item.total / totalVerificados) * 1000) / 10,
      ultimaFecha: item.ultimaFecha,
      urlFoto:     item.urlFoto
    }));
  });

  public rankingUsuariosFiltrados = computed<RankingValidadorInterface[]>(() => {
    const termino = this.normalizarTexto(this.terminoBusqueda());
    const ranking = this.rankingUsuarios();
    if (!termino) return ranking;
    return ranking.filter(v => 
      this.normalizarTexto(v.nombre).includes(termino) ||
      this.normalizarTexto(v.email).includes(termino) ||
      this.normalizarTexto(v.rol).includes(termino)
    );
  });

  public rankingRoles = computed<RankingRolInterface[]>(() => {
    const validadores = this.rankingUsuarios();
    if (!validadores || validadores.length === 0) return [];

    const totalGeneral = validadores.reduce((sum, v) => sum + v.total, 0) || 1;
    const mapaRoles    = new Map<string, {
      rol: string;
      total: number;
      validadoresSet: Set<string>;
      ultimaFecha: string;
    }>();

    for (const v of validadores) {
      const rolKey    = v.rol.toLowerCase().trim();
      const existente = mapaRoles.get(rolKey);
      if (existente) {
        existente.total += v.total;
        existente.validadoresSet.add(v.email || v.uid || v.nombre);
        if (v.ultimaFecha && (!existente.ultimaFecha || new Date(v.ultimaFecha) > new Date(existente.ultimaFecha))) {
          existente.ultimaFecha = v.ultimaFecha;
        }
      } else {
        mapaRoles.set(rolKey, {
          rol: v.rol,
          total: v.total,
          validadoresSet: new Set([v.email || v.uid || v.nombre]),
          ultimaFecha: v.ultimaFecha
        });
      }
    }

    const items = Array.from(mapaRoles.values()).map(r => ({
      rol:              r.rol,
      total:            r.total,
      porcentaje:       Math.round((r.total / totalGeneral) * 1000) / 10,
      totalValidadores: r.validadoresSet.size,
      ultimaFecha:      r.ultimaFecha
    }));

    items.sort((a, b) => b.total - a.total);

    return items.map((item, index) => ({
      posicion: index + 1,
      ...item
    }));
  });

  public totalVerificacionesRanking = computed(() => {
    return this.rankingUsuarios().reduce((sum, item) => sum + item.total, 0);
  });

  public totalValidadoresActivos = computed(() => {
    return this.rankingUsuarios().length;
  });

  public topValidador = computed<RankingValidadorInterface | null>(() => {
    const lista = this.rankingUsuarios();
    return lista.length > 0 ? lista[0] : null;
  });

  public topRol = computed<RankingRolInterface | null>(() => {
    const lista = this.rankingRoles();
    return lista.length > 0 ? lista[0] : null;
  });

  async ngOnInit(): Promise<void> {
    if (!this.authorization.esAdmin() && !this.authorization.esAgente() && !this.authorization.esDev()) {
      this.router.navigate(['/']);
      return;
    }
    await this.cargarBorradores();
  }

  async cargarBorradores(): Promise<void> {
    this.estaCargando.set(true);
    try {
      const [dataPendientes, dataVerificados, countAprobados] = await Promise.all([
        this.adminBorradorService.obtenerBorradoresPendientes(),
        this.adminBorradorService.obtenerNegociosVerificados(),
        this.adminBorradorService.obtenerConteo('Aprobado'),
        this.usuariosService.cargarUsuarios()
      ]);
      this.borradores.set(dataPendientes);
      this.verificados.set(dataVerificados);
      this.pendientes.set(dataPendientes.length);
      this.aprobados.set(countAprobados);
    } catch (error) {
      console.error('Error cargando borradores', error);
      this.snackBar.open('Error al cargar la información', 'OK', { duration: 3000 });
    } finally {
      this.estaCargando.set(false);
    }
  }

  async copiarLinkMagico(id: string): Promise<void> {
    const link = `${window.location.origin}/reclamar/${id}`;
    try {
      await navigator.clipboard.writeText(link);
      this.snackBar.open('¡Link Mágico copiado al portapapeles!', 'OK', { duration: 3000 });
    } catch (err) {
      console.error('Error al copiar el link: ', err);
      this.snackBar.open('Error al copiar el link.', 'OK', { duration: 3000 });
    }
  }

  async quitarVerificacion(id: string): Promise<void> {
    if (!this.authorization.esAdmin() && !this.authorization.esDev()) {
      this.snackBar.open('No tienes permisos para quitar la verificación', 'OK', { duration: 3000 });
      return;
    }
    try {
      await this.adminBorradorService.desverificarNegocio(id);
      this.snackBar.open('Verificación removida exitosamente', 'OK', { duration: 3000 });
      await this.cargarBorradores();
    } catch (error) {
      console.error('Error al quitar verificación', error);
      this.snackBar.open('Error al remover la verificación', 'OK', { duration: 3000 });
    }
  }

  revisarBorrador(id: string): void {
    this.router.navigate(['/admin/data-borrador/editar', id]);
  }

  actualizarBusqueda(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    this.terminoBusqueda.set(input.value);
  }

  limpiarBusqueda(): void {
    this.terminoBusqueda.set('');
  }

  cambiarVistaRanking(vista: 'usuario' | 'rol'): void {
    this.vistaRanking.set(vista);
  }

  obtenerInicial(nombre: string): string {
    return (nombre || 'U').trim().charAt(0).toUpperCase();
  }

  obtenerIconoRol(rol: string): string {
    switch (rol.toLowerCase()) {
      case 'admin': return 'admin_panel_settings';
      case 'dev': return 'terminal';
      case 'agente': return 'support_agent';
      case 'comerciante': return 'storefront';
      case 'visitante': return 'person';
      default: return 'verified_user';
    }
  }

  obtenerClaseRol(rol: string): string {
    const r = rol.toLowerCase().trim();
    if (r.includes('admin')) return 'rol-chip-admin';
    if (r.includes('dev')) return 'rol-chip-dev';
    if (r.includes('agente')) return 'rol-chip-agente';
    if (r.includes('comerciante')) return 'rol-chip-comerciante';
    return 'rol-chip-otro';
  }

  private normalizarTexto(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  private coincideCriterioBusqueda(negocio: NegocioInterface, termino: string): boolean {
    const idCompleto = this.normalizarTexto(negocio.id || '');
    const idUltimos6 = idCompleto.slice(-6);
    if (idUltimos6.includes(termino) || idCompleto.includes(termino)) {
      return true;
    }

    const nit = this.normalizarTexto(negocio.nit || (typeof negocio.metadatos?.['nit'] === 'string' ? (negocio.metadatos['nit'] as string) : ''));
    if (nit.includes(termino)) {
      return true;
    }

    const telefono = this.normalizarTexto(negocio.contacto?.telefono || '');
    const whatsapp = this.normalizarTexto(negocio.contacto?.whatsapp || '');
    if (telefono.includes(termino) || whatsapp.includes(termino)) {
      return true;
    }

    const digitosTermino = termino.replace(/\D/g, '');
    if (digitosTermino.length > 0) {
      const digitosTel = telefono.replace(/\D/g, '');
      const digitosWsp = whatsapp.replace(/\D/g, '');
      const digitosNit = nit.replace(/\D/g, '');
      if (digitosTel.includes(digitosTermino) || digitosWsp.includes(digitosTermino) || (digitosNit.length > 0 && digitosNit.includes(digitosTermino))) {
        return true;
      }
    }

    return false;
  }

  goBack(): void {
    this.location.back();
  }
}
