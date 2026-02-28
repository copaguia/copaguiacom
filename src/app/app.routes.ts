import { Routes } from '@angular/router';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { IntroComponent } from './pages/intro/intro.component';
import { RegistarNegociosComponent } from './pages/registar-negocios/registar-negocios.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { NavegacionComponent } from './pages/navegacion/navegacion.component';
import { CategoriasComponent } from './pages/categorias/categorias.component';
import { SeccionPageComponent } from './components/seccion-page/seccion-page.component';
import { DomiciliosComponent } from './pages/categorias/alimentos/domicilios/domicilios.component';
import { ComidaRapidaComponent } from './pages/categorias/alimentos/comida-rapida/comida-rapida.component';
import { RestaurantesPizzasComponent } from './pages/categorias/alimentos/restaurantes-pizzas/restaurantes-pizzas.component';
import { HeladosPostresComponent } from './pages/categorias/alimentos/helados-postres/helados-postres.component';
import { CafeteriasPanaderiasComponent } from './pages/categorias/alimentos/cafeterias-panaderias/cafeterias-panaderias.component';
import { SupermercadosComponent } from './pages/categorias/alimentos/supermercados/supermercados.component';
import { PlazaDeMercadoComponent } from './pages/categorias/alimentos/plaza-de-mercado/plaza-de-mercado.component';
import { CarniceriasLegumbreriasComponent } from './pages/categorias/alimentos/carnicerias-legumbrerias/carnicerias-legumbrerias.component';
import { HogarComponent } from './pages/categorias/comercios/hogar/hogar.component';
import { CelularesPcComponent } from './pages/categorias/comercios/celulares-pc/celulares-pc.component';
import { CosmeticosComponent } from './pages/categorias/comercios/cosmeticos/cosmeticos.component';
import { ModaCalzadoComponent } from './pages/categorias/comercios/moda-calzado/moda-calzado.component';
import { PapeleriasLibreriasComponent } from './pages/categorias/comercios/papelerias-librerias/papelerias-librerias.component';
import { RegalosJoyasComponent } from './pages/categorias/comercios/regalos-joyas/regalos-joyas.component';
import { RepuestosComponent } from './pages/categorias/comercios/repuestos/repuestos.component';
import { FerreteriasAgropecuariasComponent } from './pages/categorias/comercios/ferreterias-agropecuarias/ferreterias-agropecuarias.component';
import { TransporteComponent } from './pages/categorias/servicios/transporte/transporte.component';
import { HogarOficinaComponent } from './pages/categorias/servicios/hogar-oficina/hogar-oficina.component';
import { ConstruccionComponent } from './pages/categorias/servicios/construccion/construccion.component';
import { EventosLogisticaComponent } from './pages/categorias/servicios/eventos-logistica/eventos-logistica.component';
import { BellezaSpaComponent } from './pages/categorias/servicios/belleza-spa/belleza-spa.component';
import { DiaDeSolComponent } from './pages/categorias/entretenimiento/dia-de-sol/dia-de-sol.component';
import { DiscotecasParchesComponent } from './pages/categorias/entretenimiento/discotecas-parches/discotecas-parches.component';
import { FincasSalonesComponent } from './pages/categorias/entretenimiento/fincas-salones/fincas-salones.component';
import { DrogueriasOpticasComponent } from './pages/categorias/salud/droguerias-opticas/droguerias-opticas.component';
import { EpsHospitalesComponent } from './pages/categorias/salud/eps-hospitales/eps-hospitales.component';
import { MedicosOdontologosComponent } from './pages/categorias/salud/medicos-odontologos/medicos-odontologos.component';
import { NaturistasFisioterapiasComponent } from './pages/categorias/salud/naturistas-fisioterapias/naturistas-fisioterapias.component';
import { ClimaComponent } from './pages/categorias/entretenimiento/clima/clima.component';
import { LoginComponent } from './pages/login/login.component';
import { UserFeedComponent } from './pages/consumer/user-feed/user-feed.component';
import { CarruselComponent } from './components/carrusel/carrusel.component';
import { EventosComponent } from './pages/categorias/entretenimiento/eventos/eventos.component';
import { MarranitoComponent } from './pages/marranito/marranito.component';
import { AlimentosComponent } from './pages/categorias/alimentos/alimentos/alimentos.component';
import { ComerciosComponent } from './pages/categorias/comercios/comercios/comercios.component';
import { ServiciosComponent } from './pages/categorias/servicios/servicios/servicios.component';
import { EntretenimientoComponent } from './pages/categorias/entretenimiento/entretenimiento/entretenimiento.component';
import { SaludComponent } from './pages/categorias/salud/salud/salud.component';


export const routes: Routes = [
    // 1. RUTAS DE ENTRADA Y PRINCIPALES
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'intro', component: IntroComponent },
    { path: 'registro', component: RegistarNegociosComponent },
    { path: 'contacto' , component: ContactoComponent },
    { path: 'nav', component: NavMenuComponent, 
        children: [
            { path: 'Alimentos', component: AlimentosComponent },
            { path: 'Comercios', component: ComerciosComponent },
            { path: 'Servicios', component: ServiciosComponent },
            { path: 'Entretenimiento', component: EntretenimientoComponent },
            { path: 'Salud', component: SaludComponent },
        ] 
    }, 
    { path: 'navegacion', component: NavegacionComponent },
    { path: 'categorias', component: CategoriasComponent },
    { path: 'seccion-page', component: SeccionPageComponent },
    { path: 'seccion-page/:id', component: SeccionPageComponent },
    { path: 'carrusel', component: CarruselComponent },
    { path: 'marranito', component: MarranitoComponent },

    // 2. RUTA DEL PERFIL DE USUARIO (CAMBIO NECESARIO)
    // Se introduce el segmento fijo 'perfil' para que la URL sea /perfil/:username
    // Esto evita colisiones con rutas de nivel superior (como 'nav', 'categorias', etc.).
    {
        path: 'perfil/:username', // ¡Ruta corregida!
        component: UserFeedComponent, 
        // canActivate: [AuthGuard]
    },

    // 3. RUTAS DE CATEGORÍAS (muy específicas, no chocan con 'perfil')
    // El orden se mantiene ya que todas están bajo el prefijo 'categorias/'

    // Rutas de Categorías de Alimentos
    { path: 'categorias/Domicilios', component: DomiciliosComponent },
    { path: 'categorias/Comida Rápida', component: ComidaRapidaComponent },
    { path: 'categorias/Restaurante y Pizzas', component: RestaurantesPizzasComponent },
    { path: 'categorias/Helados y postres', component: HeladosPostresComponent },
    { path: 'categorias/Cafés y Parva', component: CafeteriasPanaderiasComponent },
    { path: 'categorias/Supermercados', component: SupermercadosComponent },
    { path: 'categorias/Plaza de Mercado', component: PlazaDeMercadoComponent },
    { path: 'categorias/Carnicerias y Legumbrerias', component: CarniceriasLegumbreriasComponent },

    // Rutas de Categorías de Comercios
    { path: 'categorias/Hogar', component: HogarComponent },
    { path: 'categorias/Celulares y PC', component: CelularesPcComponent },
    { path: 'categorias/Cosméticos', component: CosmeticosComponent },
    { path: 'categorias/Moda y Calzado', component: ModaCalzadoComponent },
    { path: 'categorias/Papelerías y librerias', component: PapeleriasLibreriasComponent },
    { path: 'categorias/Regalos y joyas', component: RegalosJoyasComponent },
    { path: 'categorias/Repuestos', component: RepuestosComponent },
    { path: 'categorias/Ferreterías y Agropecuarias', component: FerreteriasAgropecuariasComponent },

    // Rutas de Categorías de Servicios
    { path: 'categorias/Transporte', component: TransporteComponent },
    { path: 'categorias/Hogar y oficina', component: HogarOficinaComponent },
    { path: 'categorias/Construcción', component: ConstruccionComponent },
    { path: 'categorias/Automotrices', component: ComidaRapidaComponent }, 
    { path: 'categorias/Logística y eventos', component: EventosLogisticaComponent },
    { path: 'categorias/Belleza y Spa', component: BellezaSpaComponent },

    // Rutas de Categorías de Entretenimiento
    { path: 'categorias/Clima', component: ClimaComponent },
    { path: 'categorias/Día de Sol', component: DiaDeSolComponent },
    { path: 'categorias/Parches y discotecas', component: DiscotecasParchesComponent },
    { path: 'categorias/Eventos', component: EventosComponent },
    { path: 'categorias/Fincas y salones', component: FincasSalonesComponent },

    // Rutas de Categorías de Salud
    { path: 'categorias/Droguerías y opticas', component: DrogueriasOpticasComponent },
    { path: 'categorias/EPS y hospitales', component: EpsHospitalesComponent },
    { path: 'categorias/Médicos y Odontólogos', component: MedicosOdontologosComponent },
    { path: 'categorias/Naturistas y fisioterapias', component: NaturistasFisioterapiasComponent },

    // 4. RUTA GENÉRICA DE NIVEL SUPERIOR (La ruta original del problema, ahora renombrada y movida)
    /* * NOTA: Esta ruta genérica debe ir ANTES de la ruta comodín si la quieres mantener, 
     * pero es inherentemente peligrosa por las colisiones. La ruta 'perfil/:username' 
     * de arriba es mucho más segura. Si realmente quieres que /usuario funcione,
     * reemplaza la ruta de arriba con esta, pero sabiendo que puede chocar con otras rutas.
     */
    {
        path: 'public/:username', // La he renombrado para que no choque con tus rutas principales
        component: UserFeedComponent, 
        // canActivate: [AuthGuard] 
    },


    // 5. RUTA COMODÍN (WILDCARD) - SIEMPRE LA ÚLTIMA:
    { path: '**', redirectTo: '/categorias' }
];