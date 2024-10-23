import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { CategoriaInterface } from '../interfaces/categoria-interface';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.css',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe, RouterLink,RouterOutlet
  ]
})
export class NavMenuComponent {

  private firestore = inject(Firestore); // Inyectamos el servicio de Firestore
  categoria$: Observable<CategoriaInterface[]>;

  constructor() {
    // get a reference to the user-profile collection
    const categoriasCollection = collection(this.firestore, 'Menu');

    // get documents (data) from the collection using collectionData
    this.categoria$ = collectionData(categoriasCollection) as Observable<CategoriaInterface[]>;
}

  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
}
