import { Component } from '@angular/core';
import { ANTIOQUIA_HUB } from '../../../data/antioquia-hub.const';

@Component({
  selector: 'app-cards-gallery',
  imports: [],
  templateUrl: './cards-gallery.component.html',
  styleUrl: './cards-gallery.component.css',
})
export class CardsGalleryComponent {
  municipios = Object.values(ANTIOQUIA_HUB);
}
