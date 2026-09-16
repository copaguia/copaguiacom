import { Component, ChangeDetectionStrategy, input, model, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatFormFieldModule, MatIconModule, MatButtonModule],
  templateUrl: './buscador.component.html',
  styleUrl: './buscador.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuscadorComponent {
  termino = model<string>('');
  placeholder = input<string>('Buscar...');
  label = input<string>('Buscar');

  searchAction = output<string>();
  isListening = signal(false);

  emitSearch() {
    this.searchAction.emit(this.termino());
  }

  startListening() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Tu navegador no soporta búsqueda por voz.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES'; // Español general
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      this.isListening.set(true);
    };

    recognition.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript;
      // Quitamos el punto final si el navegador lo pone automático
      this.termino.set(speechResult.replace(/\.$/, ''));
      // Lanzamos la búsqueda automáticamente tras escuchar la voz
      this.emitSearch();
    };

    recognition.onerror = (event: any) => {
      console.error('Error de micrófono:', event.error);
      this.isListening.set(false);
    };

    recognition.onend = () => {
      this.isListening.set(false);
    };

    recognition.start();
  }
}
