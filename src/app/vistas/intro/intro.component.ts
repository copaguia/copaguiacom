import { Component } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
    selector: 'app-intro',
    imports: [MaterialModule, RouterLink, FooterComponent],
    templateUrl: './intro.component.html',
    styleUrl: './intro.component.css'
})
export class IntroComponent {

    

}
