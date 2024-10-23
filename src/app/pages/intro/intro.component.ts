import { Component } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [MaterialModule, RouterLink, RouterOutlet, RouterLinkActive, FooterComponent],
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.css'
})
export class IntroComponent {

}
