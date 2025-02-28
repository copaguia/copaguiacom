import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-seccion-page',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './seccion-page.component.html',
  styleUrl: './seccion-page.component.css'
})
export class SeccionPageComponent {

  public seccion!: string;
  private activatedRoute = inject(ActivatedRoute);
  constructor() {}

  ngOnInit() {
    this.seccion = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }

}
