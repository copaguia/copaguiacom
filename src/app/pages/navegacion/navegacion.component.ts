import { Component } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-navegacion',
    imports: [ MaterialModule, RouterOutlet ],
    templateUrl: './navegacion.component.html',
    styleUrl: './navegacion.component.css'
})
export class NavegacionComponent {


}
