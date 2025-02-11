import { Routes } from '@angular/router';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { RegistarNegociosComponent } from './pages/registar-negocios/registar-negocios.component';
import { IntroComponent } from './pages/intro/intro.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { NavegacionComponent } from './pages/navegacion/navegacion.component';
import { LoginComponent } from './pages/login/login.component';


export const routes: Routes = [

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
    }
];
