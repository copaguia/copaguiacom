import { Component } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { CardRComponent } from '../../components/card-r/card-r.component';
import { IonCol, IonContent, IonGrid, IonRow } from '@ionic/angular/standalone';

@Component({
  selector: 'app-navegacion',
  standalone: true,
  imports: [MaterialModule, CardRComponent],
  templateUrl: './navegacion.component.html',
  styleUrl: './navegacion.component.css'
})
export class NavegacionComponent {

}
