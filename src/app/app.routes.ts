import { Routes } from '@angular/router';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { RegistarNegociosComponent } from './pages/registar-negocios/registar-negocios.component';
import { IntroComponent } from './pages/intro/intro.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { NavegacionComponent } from './pages/navegacion/navegacion.component';


export const routes: Routes = [
    {
        path: '', component: IntroComponent
    },

    {
        path: 'registro', component: RegistarNegociosComponent
    },
    

    {
        path: 'contacto' , component: ContactoComponent
    },

    {
        path:'nav', component: NavMenuComponent
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
