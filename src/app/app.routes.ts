import { Routes } from '@angular/router';
import { NavMenuComponent } from './views/nav-menu/nav-menu.component';
import { RegistarNegociosComponent } from './views/registar-negocios/registar-negocios.component';
import { CategoriasComponent } from './views/categorias/categorias.component';
import { SeccionPageComponent } from './components/build/seccion-page/seccion-page.component';
import { LoginComponent } from './views/login/login.component';
import { UserFeedComponent } from './views/consumer/user-feed/user-feed.component';
import { CarruselComponent } from './components/build/carrusel/carrusel.component';
import { MarranitoComponent } from './views/marranito/marranito.component';
import { OnboardingNegocioRegistroComponent } from './views/onboarding-negocio-registro/onboarding-negocio-registro.component';
import { PerfilNegocioEditorComponent } from './views/perfil-negocio-editor/perfil-negocio-editor.component';
import { AdminPromocionesComponent } from './views/admin/admin-promociones/admin-promociones.component';
import { DetalleNegocioComponent } from './views/detalle-negocio/detalle-negocio.component';
import { CategoriaPageComponent } from './components/build/categoria-page/categoria-page.component';
import { AgregarNegocioComponent } from './views/admin/agregar-negocio/agregar-negocio.component';
import { EstadisticasComponent } from './views/admin/estadisticas/estadisticas.component';

import { AdminPublicidadComponent } from './views/admin/admin-publicidad/admin-publicidad.component';
import { SistemaPautasComponent } from './views/admin/sistema-pautas/sistema-pautas.component';
import { BuscadorMaestroComponent } from './components/build/buscador-maestro/buscador-maestro.component';
import { CarritoPedidoComponent } from './views/carrito-pedido/carrito-pedido.component';
import { DashboardDuenoComponent } from './views/dashboard-dueno/dashboard-dueno.component';
import { GestionCatalogoComponent } from './views/gestion-catalogo/gestion-catalogo.component';
import { MarketPlaceGlobalComponent } from './views/market-place-global/market-place-global.component';
import { SoporteConsolaComponent } from './views/soporte-consola/soporte-consola.component';
import { DataBorradorComponent } from './views/admin/data-borrador/data-borrador.component';
import { AdminBorradorEditorComponent } from './views/admin/admin-borrador-editor/admin-borrador-editor.component';
import { ClasificadosComponent } from './views/clasificados/clasificados.component';
import { MarketplaceComponent } from './views/marketplace/marketplace.component';
// Import category data to be the single source of truth
import { categoriaData } from './data/categoriasData';
import { rolesGuard } from './guards/auth.guard';

// --- Static routes of the application ---
const staticRoutes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {
        path: 'auth-hub',
        loadComponent: () => import('./views/auth-hub/auth-hub.component').then(m => m.AuthHubComponent)
    },
    {
        path: 'auth-callback',
        loadComponent: () => import('./views/auth-callback/auth-callback.component').then(m => m.AuthCallbackComponent)
    },
    { path: 'registro', component: RegistarNegociosComponent },
    { path: 'onboarding-negocio-registro', component: OnboardingNegocioRegistroComponent },
    {
        path: 'admin/promociones', 
        component: AdminPromocionesComponent,
    },
    {
        path: 'admin/agregar-negocio',
        component: AgregarNegocioComponent
    },
    {
        path: 'admin/estadisticas',
        component: EstadisticasComponent
    },
    {
        path: 'admin/publicidad',
        component: AdminPublicidadComponent
    },
    {
        path: 'admin/sistema-pautas',
        component: SistemaPautasComponent
    },
    { 
        path: 'admin/data-borrador', 
        component: DataBorradorComponent,
        canActivate: [rolesGuard],
        data: { roles: ['admin', 'dev'] }
    },
    { 
        path: 'admin/data-borrador/editar/:id', 
        component: AdminBorradorEditorComponent,
        canActivate: [rolesGuard],
        data: { roles: ['admin', 'dev'] }
    },
    {
        path: 'admin/dev-dashboard',
        loadComponent: () => import('./views/admin/dev-dashboard/dev-dashboard.component').then(m => m.DevDashboardComponent),
        canActivate: [rolesGuard],
        data: { roles: ['dev', 'admin'] }
    },
    {
        path: 'admin/hub-antioquia',
        loadComponent: () => import('./views/admin/admin-municipios-hub/admin-municipios-hub.component').then(m => m.AdminMunicipiosHubComponent),
        canActivate: [rolesGuard],
        data: { roles: ['dev', 'admin'] }
    },
    { path: 'nav', component: NavMenuComponent, 
        children: [ ] 
    }, 
    { path: 'buscar', component: BuscadorMaestroComponent },
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
        path: 'negocio/:slug', component: DetalleNegocioComponent
    },
    {
        path: 'reclamar/:id',
        loadComponent: () => import('./views/reclamar-negocio/reclamar-negocio.component').then(m => m.ReclamarNegocioComponent)
    },
    {
        path: 'public/:username',
        component: UserFeedComponent, 
    },
    { path: 'carrito-pedido', component: CarritoPedidoComponent },
    { path: 'dashboard-dueno', component: DashboardDuenoComponent },
    { path: 'gestion-catalogo', component: GestionCatalogoComponent },
    { path: 'market-place-global', component: MarketPlaceGlobalComponent },
    { path: 'soporte-consola', component: SoporteConsolaComponent },
    { path: 'clasificados', component: ClasificadosComponent },
    { path: 'marketplace', component: MarketplaceComponent },
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
