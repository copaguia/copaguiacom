import { Component, inject, signal, DestroyRef } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GlobalNotificationService } from '../../core/services/global-notification.service';
import { GlobalNotificationDialogComponent } from '../../components/build/global-notification-dialog/global-notification-dialog.component';
import { CategoriasInterface, categoriaData } from '../../data/categoriasData';
import { RouterLink, RouterOutlet } from '@angular/router';
import { PublicidadService } from '../../core/services/publicidad.service';

@Component({
    selector: 'app-nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrl: './nav-menu.component.css',
    imports: [
        MatToolbarModule, MatButtonModule, MatSidenavModule, MatListModule, MatIconModule, AsyncPipe, RouterLink, RouterOutlet, MatDialogModule
    ]
})
export class NavMenuComponent {
  public globalNotifService = inject(GlobalNotificationService);
  private dialog = inject(MatDialog);

  categorias = signal<CategoriasInterface[]>([
    { ruta:'Alimentos',      icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif' },
    { ruta:'Comercios',      icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif' },
    { ruta:'Servicios',      icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif' },
    { ruta:'Entretenimiento',icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif' },
    { ruta:'Salud',          icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif' },
  ]);

  categoriasConPromo    = signal<Set<string>>(new Set());
  public publicidadService = inject(PublicidadService);
  private destroyRef       = inject(DestroyRef);

  constructor() {
    const unsub = this.publicidadService.escucharPromocionesActivas(
      this.categorias().map(c => c.ruta),
      set => this.categoriasConPromo.set(set)
    );
    this.destroyRef.onDestroy(unsub);
  }
  
 

  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset) .pipe(  map(result => result.matches),   shareReplay()  );


}
