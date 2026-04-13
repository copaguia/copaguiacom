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
import { AgregarNegocioComponent } from './views/admin/agregar-negocio/agregar-negocio.component'; // Import new component

export const routes: Routes = [
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
    // Add new route for adding businesses
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
    { path: 'categorias/Domicilios', component: CategoriaPageComponent, data: { title: 'Domicilios', categoria: 'Alimentos', seccion: 'Domicilios' } },
    { path: 'categorias/Comida Rápida', component: CategoriaPageComponent, data: { title: 'Comida Rápida', categoria: 'Alimentos', seccion: 'Comida Rápida' } },
    { path: 'categorias/Restaurante y Pizzas', component: CategoriaPageComponent, data: { title: 'Restaurante y Pizzas', categoria: 'Alimentos', seccion: 'Restaurante y Pizzas' } },
    { path: 'categorias/Helados y postres', component: CategoriaPageComponent, data: { title: 'Helados y postres', categoria: 'Alimentos', seccion: 'Helados y postres' } },
    { path: 'categorias/Cafés y Parva', component: CategoriaPageComponent, data: { title: 'Cafés y Parva', categoria: 'Alimentos', seccion: 'Cafés y Parva' } },
    { path: 'categorias/Supermercados', component: CategoriaPageComponent, data: { title: 'Supermercados', categoria: 'Alimentos', seccion: 'Supermercados' } },
    { path: 'categorias/Plaza de Mercado', component: CategoriaPageComponent, data: { title: 'Plaza de Mercado', categoria: 'Alimentos', seccion: 'Plaza de Mercado' } },
    { path: 'categorias/Carnicerias y Legumbrerias', component: CategoriaPageComponent, data: { title: 'Carnicerias y Legumbrerias', categoria: 'Alimentos', seccion: 'Carnicerias y Legumbrerias' } },
    { path: 'categorias/Hogar', component: CategoriaPageComponent, data: { title: 'Hogar', categoria: 'Comercios', seccion: 'Hogar' } },
    { path: 'categorias/Celulares y PC', component: CategoriaPageComponent, data: { title: 'Celulares y PC', categoria: 'Comercios', seccion: 'Celulares y PC' } },
    { path: 'categorias/Cosméticos', component: CategoriaPageComponent, data: { title: 'Cosméticos', categoria: 'Comercios', seccion: 'Cosméticos' } },
    { path: 'categorias/Moda y Calzado', component: CategoriaPageComponent, data: { title: 'Moda y Calzado', categoria: 'Comercios', seccion: 'Moda y Calzado' } },
    { path: 'categorias/Papelerías y librerias', component: CategoriaPageComponent, data: { title: 'Papelerías y librerias', categoria: 'Comercios', seccion: 'Papelerías y librerias' } },
    { path: 'categorias/Regalos y joyas', component: CategoriaPageComponent, data: { title: 'Regalos y joyas', categoria: 'Comercios', seccion: 'Regalos y joyas' } },
    { path: 'categorias/Repuestos', component: CategoriaPageComponent, data: { title: 'Repuestos', categoria: 'Comercios', seccion: 'Repuestos' } },
    { path: 'categorias/Ferreterías y Agropecuarias', component: CategoriaPageComponent, data: { title: 'Ferreterías y Agropecuarias', categoria: 'Comercios', seccion: 'Ferreterías y Agropecuarias' } },
    { path: 'categorias/Transporte', component: CategoriaPageComponent, data: { title: 'Transporte', categoria: 'Servicios', seccion: 'Transporte' } },
    { path: 'categorias/Hogar y oficina', component: CategoriaPageComponent, data: { title: 'Hogar y oficina', categoria: 'Servicios', seccion: 'Hogar y oficina' } },
    { path: 'categorias/Construcción', component: CategoriaPageComponent, data: { title: 'Construcción', categoria: 'Servicios', seccion: 'Construcción' } },
    { path: 'categorias/Automotrices', component: CategoriaPageComponent, data: { title: 'Automotrices', categoria: 'Servicios', seccion: 'Automotrices' } },
    { path: 'categorias/Logística y eventos', component: CategoriaPageComponent, data: { title: 'Logística y eventos', categoria: 'Servicios', seccion: 'Logística y eventos' } },
    { path: 'categorias/Belleza y Spa', component: CategoriaPageComponent, data: { title: 'Belleza y Spa', categoria: 'Servicios', seccion: 'Belleza y Spa' } },
    { path: 'categorias/Clima', component: CategoriaPageComponent, data: { title: 'Clima', categoria: 'Entretenimiento', seccion: 'Clima' } },
    { path: 'categorias/Día de Sol', component: CategoriaPageComponent, data: { title: 'Día de Sol', categoria: 'Entretenimiento', seccion: 'Día de Sol' } },
    { path: 'categorias/Parches y discotecas', component: CategoriaPageComponent, data: { title: 'Parches y discotecas', categoria: 'Entretenimiento', seccion: 'Parches y discotecas' } },
    { path: 'categorias/Eventos', component: CategoriaPageComponent, data: { title: 'Eventos', categoria: 'Entretenimiento', seccion: 'Eventos' } },
    { path: 'categorias/Fincas y salones', component: CategoriaPageComponent, data: { title: 'Fincas y salones', categoria: 'Entretenimiento', seccion: 'Fincas y salones' } },
    { path: 'categorias/Droguerías y opticas', component: CategoriaPageComponent, data: { title: 'Droguerías y opticas', categoria: 'Salud', seccion: 'Droguerías y opticas' } },
    { path: 'categorias/EPS y hospitales', component: CategoriaPageComponent, data: { title: 'EPS y hospitales', categoria: 'Salud', seccion: 'EPS y hospitales' } },
    { path: 'categorias/Médicos y Odontólogos', component: CategoriaPageComponent, data: { title: 'Médicos y Odontólogos', categoria: 'Salud', seccion: 'Médicos y Odontólogos' } },
    { path: 'categorias/Naturistas y fisioterapias', component: CategoriaPageComponent, data: { title: 'Naturistas y fisioterapias', categoria: 'Salud', seccion: 'Naturistas y fisioterapias' } },
    {
        path: 'public/:username',
        component: UserFeedComponent, 
    },
    { path: '**', redirectTo: '/categorias' }
];
