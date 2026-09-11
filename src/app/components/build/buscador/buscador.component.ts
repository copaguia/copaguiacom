import { Component, ChangeDetectionStrategy, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatFormFieldModule, MatIconModule],
  templateUrl: './buscador.component.html',
  styleUrl: './buscador.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuscadorComponent {
  termino = model<string>('');
  placeholder = input<string>('Buscar...');
  label = input<string>('Buscar');
}
