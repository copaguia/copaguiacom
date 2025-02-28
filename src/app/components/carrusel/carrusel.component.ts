import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';

// IMPORTAMOS SWIPER JS

// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
// register Swiper custom elements
register();


//  CREMAMOS LA INTERFACE DEL BANNER
export interface BannerInterface {
  id?: string;
  url: string;
}

@Component({
  selector: 'app-carrusel',
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './carrusel.component.html',
  styleUrl: './carrusel.component.css'
})
export class CarruselComponent {  

  // Creamos un input para recibir los slides
  @Input() conector: BannerInterface[] = [];

}
