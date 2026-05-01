import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './tools/material/material.module';

@Component({
    selector: 'app-root',
    imports: [MaterialModule, RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'myapp';
}
