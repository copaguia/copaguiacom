import { Component, signal } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CategoriaInterface } from '../../interfaces/categoria-interface';
import { botonesData } from '../../staticData/botonesData';

@Component({
    selector: 'app-navegacion',
    imports: [ MaterialModule, RouterLink, RouterOutlet ],
    templateUrl: './navegacion.component.html',
    styleUrl: './navegacion.component.css'
})
export class NavegacionComponent {

    categorias = signal<CategoriaInterface[]>([]);

    constructor () {
        const botonesCategorias = botonesData;
        this.categorias.set(botonesCategorias);
    }

}
