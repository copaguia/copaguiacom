import { Component, Input } from '@angular/core';
import { CardInterface } from '../../interfaces/card-interface';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-card-r',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './card-r.component.html',
  styleUrl: './card-r.component.css'
})
export class CardRComponent {

  @Input() conector!: CardInterface;

}
