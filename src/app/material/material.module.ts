import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatListModule} from '@angular/material/list';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSortModule} from '@angular/material/sort';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTreeModule} from '@angular/material/tree';
import {MatSidenavModule} from '@angular/material/sidenav';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatToolbarModule, MatCardModule, 
    MatChipsModule, MatDatepickerModule, MatDialogModule, MatExpansionModule,
    MatFormFieldModule, MatGridListModule, MatInputModule, MatMenuModule, MatListModule, MatPaginatorModule,
    MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatSelectModule, MatSlideToggleModule, 
    MatSortModule, MatStepperModule, MatTableModule, MatTabsModule, MatTreeModule, MatSidenavModule, 

  ],
  exports: [
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatToolbarModule, MatCardModule, 
    MatChipsModule, MatDatepickerModule, MatDialogModule, MatExpansionModule,
    MatFormFieldModule, MatGridListModule, MatInputModule, MatMenuModule, MatListModule, MatPaginatorModule,
    MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatSelectModule, MatSlideToggleModule, 
    MatSortModule, MatStepperModule, MatTableModule, MatTabsModule, MatTreeModule, MatSidenavModule
  ]

})
export class MaterialModule { }
