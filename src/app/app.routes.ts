import { Routes } from '@angular/router';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { LoginComponent } from './vistas/login/login.component';
import { IntroComponent } from './vistas/intro/intro.component';
import { RegistarNegociosComponent } from './vistas/registar-negocios/registar-negocios.component';
import { ContactoComponent } from './vistas/contacto/contacto.component';
import { NavegacionComponent } from './vistas/navegacion/navegacion.component';
import { LoginGComponent } from './login-g/login-g.component';
import { CategoriasComponent } from './vistas/categorias/categorias.component';


export const routes: Routes = [
    
    { path: 'loginG', component: LoginGComponent },

    { path: 'login', component: LoginComponent },
    
    { path: '', redirectTo: '/intro', pathMatch: 'full' },

    {
        path: 'intro', component: IntroComponent
    },

    

    {
        path: 'registro', component: RegistarNegociosComponent
    },
    

    {
        path: 'contacto' , component: ContactoComponent
    },

    {
        path:'nav', component: NavMenuComponent,
        //canActivate: [authGuard]
    },
    
    {
        path:'navegacion', component: NavegacionComponent
    },
    {
        path: '', component: NavMenuComponent,
        children: [

        ]
    },
    {
        path:'categorias', component: CategoriasComponent
    },
];
