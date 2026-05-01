import { Component, inject, signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CategoriasInterface, categoriaData } from '../../data/categoriasData';

@Component({
    selector: 'app-nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrl: './nav-menu.component.css',
    imports: [
        MatToolbarModule, MatButtonModule, MatSidenavModule,  MatListModule,    MatIconModule,  AsyncPipe, RouterLink, RouterOutlet
    ]
})
export class NavMenuComponent {

  categorias = signal<CategoriasInterface[]>([
    {
      ruta:'Alimentos',
      icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
    },
    {
      ruta:'Comercios',
      icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
    },
    {
      ruta:'Servicios',
      icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
    },
    {
      ruta:'Entretenimiento',
      icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
    },
    {
      ruta:'Salud',
      icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
    },


    
  ]);
  
 

  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset) .pipe(  map(result => result.matches),   shareReplay()  );
}
