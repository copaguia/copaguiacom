import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MaterialModule } from '../../tools/material/material.module';


import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';



@Component({
    selector: 'app-registar-negocios',
    imports: [MaterialModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './registar-negocios.component.html',
    styleUrl: './registar-negocios.component.css'
})
export class RegistarNegociosComponent {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  

}
