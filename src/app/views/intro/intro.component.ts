import { Component } from '@angular/core';
import { MaterialModule } from '../../tools/material/material.module';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-intro',
    imports: [MaterialModule, RouterLink],
    templateUrl: './intro.component.html',
    styleUrl: './intro.component.css'
})
export class IntroComponent {

    

}
