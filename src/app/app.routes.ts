import { Routes } from '@angular/router';
import { NavMenuComponent } from './views/nav-menu/nav-menu.component';
import { IntroComponent } from './views/intro/intro.component';
import { RegistarNegociosComponent } from './views/registar-negocios/registar-negocios.component';
import { ContactoComponent } from './views/contacto/contacto.component';
import { NavegacionComponent } from './views/navegacion/navegacion.component';
import { CategoriasComponent } from './views/categorias/categorias.component';
import { SeccionPageComponent } from './components/build/seccion-page/seccion-page.component';
import { LoginComponent } from './views/login/login.component';
import { UserFeedComponent } from './views/consumer/user-feed/user-feed.component';
import { CarruselComponent } from './components/build/carrusel/carrusel.component';
import { MarranitoComponent } from './views/marranito/marranito.component';
import { OnboardingNegocioRegistroComponent } from './views/onboarding-negocio-registro/onboarding-negocio-registro.component';
import { PerfilNegocioEditorComponent } from './views/perfil-negocio-editor/perfil-negocio-editor.component';
import { AdminPromocionesComponent } from './views/admin/admin-promociones/admin-promociones.component';
import { CategoriaPageComponent } from './components/build/categoria-page/categoria-page.component';
import { AgregarNegocioComponent } from './views/admin/agregar-negocio/agregar-negocio.component';

// Import category data to be the single source of truth
import { categoriaData } from './data/categoriasData';

// --- Static routes of the application ---
const staticRoutes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'intro', component: IntroComponent },
    { path: 'registro', component: RegistarNegociosComponent },
    { path: 'onboarding-negocio-registro', component: OnboardingNegocioRegistroComponent },
    { path: 'contacto' , component: ContactoComponent },
    {
        path: 'admin/promociones', 
        component: AdminPromocionesComponent,
    },
    {
        path: 'admin/agregar-negocio',
        component: AgregarNegocioComponent
    },
    { path: 'nav', component: NavMenuComponent, 
        children: [ ] 
    }, 
    { path: 'navegacion', component: NavegacionComponent },
    { path: 'categorias', component: CategoriasComponent },
    { path: 'seccion-page', component: SeccionPageComponent },
    { path: 'seccion-page/:id', component: SeccionPageComponent },
    { path: 'carrusel', component: CarruselComponent },
    { path: 'marranito', component: MarranitoComponent },
    {
        path: 'perfil/:username',
        component: UserFeedComponent,
    },
    {
        path: 'perfil-negocio-editor', component: PerfilNegocioEditorComponent
    },
    {
        path: 'public/:username',
        component: UserFeedComponent, 
    },
];

            // --- ESTA FUNCION CONSTRUYE LAS RUTAS A LARTIR DEL ARCHVIO UNICO DE CATEGORIASDATA---
            const categoryRoutes: Routes = [];
            categoriaData.forEach(category => {
                if (category.seccion) {
                    category.seccion.forEach(section => {
                        if (section.ruta) {
                            categoryRoutes.push({
                                path: `categorias/${section.ruta}`,
                                component: CategoriaPageComponent,
                                data: { title: section.ruta, categoria: category.ruta, seccion: section.ruta }
                            });
                        }
                    });
                }
            });


// --- Final routes configuration ---
export const routes: Routes = [
    ...staticRoutes,
    ...categoryRoutes,
    { path: '**', redirectTo: '/categorias' }
];
