import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

// IMPORTAMOS SWIPER JS

// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
// register Swiper custom elements
register();


//  CREMAMOS LA INTERFACE DEL BANNER
export interface BannerInterface {
  id?: string;
  image: string;
  whatsapp?: number;
  phoneFijo?: number;
  patrocinador?: string;
}

@Component({
  selector: 'app-carrusel',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './carrusel.component.html',
  styleUrl: './carrusel.component.css'
})
export class CarruselComponent {  

  // Creamos un input para recibir los slides
  @Input() conector: BannerInterface[] = [];

}
