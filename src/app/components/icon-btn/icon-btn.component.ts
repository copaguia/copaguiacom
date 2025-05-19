import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

interface iconBtnInterface {
  ariaLabel?: string;  
  color?: 'primary' | 'accent' | 'warn' | 'default';
  disabled?: boolean;
  route?: string;
  icon: string;
}

@Component({
  selector: 'app-icon-btn',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './icon-btn.component.html',
  styleUrl: './icon-btn.component.css'
})
export class IconBtnComponent {

  @Input() conector!: iconBtnInterface;

  //conector = input<iconBtnInterface>();

}
