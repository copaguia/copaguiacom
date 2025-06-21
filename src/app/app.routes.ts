import { Routes } from '@angular/router';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { IntroComponent } from './vistas/intro/intro.component';
import { RegistarNegociosComponent } from './vistas/registar-negocios/registar-negocios.component';
import { ContactoComponent } from './vistas/contacto/contacto.component';
import { NavegacionComponent } from './vistas/navegacion/navegacion.component';
import { CategoriasComponent } from './vistas/categorias/categorias.component';
import { SeccionPageComponent } from './components/seccion-page/seccion-page.component';
import { CarruselComponent } from './components/carrusel/carrusel.component';
import { DomiciliosComponent } from './vistas/categorias/alimentos/domicilios/domicilios.component';
import { ComidaRapidaComponent } from './vistas/categorias/alimentos/comida-rapida/comida-rapida.component';
import { RestaurantesPizzasComponent } from './vistas/categorias/alimentos/restaurantes-pizzas/restaurantes-pizzas.component';
import { HeladosPostresComponent } from './vistas/categorias/alimentos/helados-postres/helados-postres.component';
import { CafeteriasPanaderiasComponent } from './vistas/categorias/alimentos/cafeterias-panaderias/cafeterias-panaderias.component';
import { SupermercadosComponent } from './vistas/categorias/alimentos/supermercados/supermercados.component';
import { PlazaDeMercadoComponent } from './vistas/categorias/alimentos/plaza-de-mercado/plaza-de-mercado.component';
import { CarniceriasLegumbreriasComponent } from './vistas/categorias/alimentos/carnicerias-legumbrerias/carnicerias-legumbrerias.component';
import { HogarComponent } from './vistas/categorias/comercios/hogar/hogar.component';
import { CelularesPcComponent } from './vistas/categorias/comercios/celulares-pc/celulares-pc.component';
import { CosmeticosComponent } from './vistas/categorias/comercios/cosmeticos/cosmeticos.component';
import { ModaCalzadoComponent } from './vistas/categorias/comercios/moda-calzado/moda-calzado.component';
import { PapeleriasLibreriasComponent } from './vistas/categorias/comercios/papelerias-librerias/papelerias-librerias.component';
import { RegalosJoyasComponent } from './vistas/categorias/comercios/regalos-joyas/regalos-joyas.component';
import { RepuestosComponent } from './vistas/categorias/comercios/repuestos/repuestos.component';
import { FerreteriasAgropecuariasComponent } from './vistas/categorias/comercios/ferreterias-agropecuarias/ferreterias-agropecuarias.component';
import { TransporteComponent } from './vistas/categorias/servicios/transporte/transporte.component';
import { HogarOficinaComponent } from './vistas/categorias/servicios/hogar-oficina/hogar-oficina.component';
import { ConstruccionComponent } from './vistas/categorias/servicios/construccion/construccion.component';
import { EventosLogisticaComponent } from './vistas/categorias/servicios/eventos-logistica/eventos-logistica.component';
import { BellezaSpaComponent } from './vistas/categorias/servicios/belleza-spa/belleza-spa.component';
import { DiaDeSolComponent } from './vistas/categorias/entretenimiento/dia-de-sol/dia-de-sol.component';
import { DiscotecasParchesComponent } from './vistas/categorias/entretenimiento/discotecas-parches/discotecas-parches.component';
import { EventosComponent } from './vistas/categorias/entretenimiento/eventos/eventos.component';
import { FincasSalonesComponent } from './vistas/categorias/entretenimiento/fincas-salones/fincas-salones.component';
import { DrogueriasOpticasComponent } from './vistas/categorias/salud/droguerias-opticas/droguerias-opticas.component';
import { EpsHospitalesComponent } from './vistas/categorias/salud/eps-hospitales/eps-hospitales.component';
import { MedicosOdontologosComponent } from './vistas/categorias/salud/medicos-odontologos/medicos-odontologos.component';
import { NaturistasFisioterapiasComponent } from './vistas/categorias/salud/naturistas-fisioterapias/naturistas-fisioterapias.component';
import { ClimaComponent } from './vistas/categorias/entretenimiento/clima/clima.component';


export const routes: Routes = [
    
    
    
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
    {   path: '', component: NavMenuComponent,
        children: [

        ]
    },
    {
        path:'categorias', component: CategoriasComponent
    },
    {
        path:'seccion-page', component: SeccionPageComponent
    },
    {
        path: 'seccion-page/:id', component: SeccionPageComponent                      
    },
    {
        path: 'carrusel', component: CarruselComponent                      
    },

    {
        path: 'categorias/Domicilios', component: DomiciliosComponent
    },
    {
        path: 'categorias/Comida Rápida', component: ComidaRapidaComponent
    },
    {
        path: 'categorias/Restaurante y Pizzas', component: RestaurantesPizzasComponent
    },
    {
        path: 'categorias/Helados y postres', component: HeladosPostresComponent
    },
    {
        path: 'categorias/Cafés y Parva', component: CafeteriasPanaderiasComponent
    },
    {
        path: 'categorias/Supermercados', component: SupermercadosComponent
    },
    {
        path: 'categorias/Plaza de Mercado', component: PlazaDeMercadoComponent
    },
    {
        path: 'categorias/Carnicerias y Legumbrerias', component: CarniceriasLegumbreriasComponent
    },
    {
        path: 'categorias/Hogar', component: HogarComponent
    },
    {
        path: 'categorias/Celulares y PC', component: CelularesPcComponent
    },
    {
        path: 'categorias/Cosméticos', component: CosmeticosComponent
    },
    {
        path: 'categorias/Moda y Calzado', component: ModaCalzadoComponent
    },
    {
        path: 'categorias/Papelerías y librerias', component: PapeleriasLibreriasComponent
    },
    {
        path: 'categorias/Regalos y joyas', component: RegalosJoyasComponent
    },
    {
        path: 'categorias/Repuestos', component: RepuestosComponent
    },
    {
        path: 'categorias/Ferreterías y Agropecuarias', component: FerreteriasAgropecuariasComponent
    },
    {
        path: 'categorias/Transporte', component: TransporteComponent
    },
    {
        path: 'categorias/Hogar y oficina', component: HogarOficinaComponent
    },
    {
        path: 'categorias/Construcción', component: ConstruccionComponent
    },
    {
        path: 'categorias/Automotrices', component: ComidaRapidaComponent
    },
    {
        path: 'categorias/Logística y eventos', component: EventosLogisticaComponent
    },
    {
        path: 'categorias/Belleza y Spa', component: BellezaSpaComponent
    },
    {
        path: 'categorias/Clima', component: ClimaComponent
    },
    
    {
        path: 'categorias/Día de Sol', component: DiaDeSolComponent
    },
    {
        path: 'categorias/Parches y discotecas', component: DiscotecasParchesComponent
    },
    {
        path: 'categorias/Eventos', component: EventosComponent
    },
    {
        path: 'categorias/Fincas y salones', component: FincasSalonesComponent
    },
    {
        path: 'categorias/Droguerías y opticas', component: DrogueriasOpticasComponent
    },
    {
        path: 'categorias/EPS y hospitales', component: EpsHospitalesComponent
    },
    {
        path: 'categorias/Médicos y Odontólogos', component: MedicosOdontologosComponent
    },
    {
        path: 'categorias/Naturistas y fisioterapias', component: NaturistasFisioterapiasComponent
    },

    



    
];
