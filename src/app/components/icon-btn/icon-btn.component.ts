import { CommonModule } from '@angular/common';
import { Component, Input, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

interface iconBtnInterface {
  ariaLabel?: string;
  color?: 'primary' | 'accent' | 'warn' | 'default' ;
  disabled?: boolean;
  route?: string;
  icon: string;
  name?: string;
  type?:  'mat-fab' | 'mat-mini-fab' | 'mat-icon-button' | 'mat-raised-button' | 'mat-flat-button' | 'mat-stroked-button'; // Agregados nuevos tipos
}

enum typeEnumV19 {  
  'Basic' = 'mat-button',
  'Raised' = 'mat-raised-button',
  'Stroked' = 'mat-stroked-button',
  'Flat' = 'mat-flat-button',
  'Icon' = 'mat-icon-button',
  'FAB' = 'mat-fab',
  'Mini FAB' = 'mat-mini-fab',
  'Extended Fab' = 'mat-fab extended'
}

enum typeEnum20 {
  'Text' = 'matButton',
  'Elevated' = 'matButton="elevated"',
  'Outlined' = 'matButton="outlined"',
  'Filled' = 'matButton="filled"',
  'Tonal' = 'matButton="tonal"',
  'Icon' = 'matIconButton',
  'Floating Action Button ' = 'matFab',
  'Mini FAB' = 'matMiniFab',
  'Extended FAB' = 'matFab extended'
}

@Component({
  selector: 'app-icon-btn',
  standalone: true,
  imports: [ CommonModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './icon-btn.component.html',
  styleUrl: './icon-btn.component.css'
})
export class IconBtnComponent {

  // creo una varible signal de tipo Interface
  conector = input<iconBtnInterface>();

}
