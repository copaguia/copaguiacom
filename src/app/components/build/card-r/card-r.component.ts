import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CardInterface } from '../../../interfaces/card-interface';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-card-r',
    imports: [MatCardModule, MatButtonModule],
    templateUrl: './card-r.component.html',
    styleUrl: './card-r.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardRComponent {

  @Input() conector!: CardInterface;

}
