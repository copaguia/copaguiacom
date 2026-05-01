import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SeccionInterface } from '../../../data/categoriasData';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-scroll-botones',
  imports: [ MatButtonModule, MatIconModule, ScrollingModule, CommonModule, RouterLink],
  templateUrl: './scroll-botones.component.html',
  styleUrl: './scroll-botones.component.css',
  
  encapsulation: ViewEncapsulation.None, // 
})
export class ScrollBotonesComponent {

  @Input() conector: SeccionInterface[] = [];

}
