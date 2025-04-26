import { CommonModule, Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';


@Component({
  selector: 'app-tool-bar-page',
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './tool-bar-page.component.html',
  styleUrl: './tool-bar-page.component.css'
})
export class ToolBarPageComponent {
  @Input() title: string;

  
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() buttonClass: string = '';
  @Input() showIcon: boolean = true;
  @Input() icon: string = 'arrow_back';

  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}

