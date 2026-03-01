import { Routes } from '@angular/router';
import { NavMenuComponent } from './views/nav-menu/nav-menu.component';
import { IntroComponent } from './views/intro/intro.component';
import { RegistarNegociosComponent } from './views/registar-negocios/registar-negocios.component';
import { ContactoComponent } from './views/contacto/contacto.component';
import { NavegacionComponent } from './views/navegacion/navegacion.component';
import { CategoriasComponent } from './views/categorias/categorias.component';
import { SeccionPageComponent } from './components/build/seccion-page/seccion-page.component';
import { DomiciliosComponent } from './views/categorias/alimentos/domicilios/domicilios.component';
import { ComidaRapidaComponent } from './views/categorias/alimentos/comida-rapida/comida-rapida.component';
import { RestaurantesPizzasComponent } from './views/categorias/alimentos/restaurantes-pizzas/restaurantes-pizzas.component';
import { HeladosPostresComponent } from './views/categorias/alimentos/helados-postres/helados-postres.component';
import { CafeteriasPanaderiasComponent } from './views/categorias/alimentos/cafeterias-panaderias/cafeterias-panaderias.component';
import { SupermercadosComponent } from './views/categorias/alimentos/supermercados/supermercados.component';
import { PlazaDeMercadoComponent } from './views/categorias/alimentos/plaza-de-mercado/plaza-de-mercado.component';
import { CarniceriasLegumbreriasComponent } from './views/categorias/alimentos/carnicerias-legumbrerias/carnicerias-legumbrerias.component';
import { HogarComponent } from './views/categorias/comercios/hogar/hogar.component';
import { CelularesPcComponent } from './views/categorias/comercios/celulares-pc/celulares-pc.component';
import { CosmeticosComponent } from './views/categorias/comercios/cosmeticos/cosmeticos.component';
import { ModaCalzadoComponent } from './views/categorias/comercios/moda-calzado/moda-calzado.component';
import { PapeleriasLibreriasComponent } from './views/categorias/comercios/papelerias-librerias/papelerias-librerias.component';
import { RegalosJoyasComponent } from './views/categorias/comercios/regalos-joyas/regalos-joyas.component';
import { RepuestosComponent } from './views/categorias/comercios/repuestos/repuestos.component';
import { FerreteriasAgropecuariasComponent } from './views/categorias/comercios/ferreterias-agropecuarias/ferreterias-agropecuarias.component';
import { TransporteComponent } from './views/categorias/servicios/transporte/transporte.component';
import { HogarOficinaComponent } from './views/categorias/servicios/hogar-oficina/hogar-oficina.component';
import { ConstruccionComponent } from './views/categorias/servicios/construccion/construccion.component';
import { EventosLogisticaComponent } from './views/categorias/servicios/eventos-logistica/eventos-logistica.component';
import { BellezaSpaComponent } from './views/categorias/servicios/belleza-spa/belleza-spa.component';
import { DiaDeSolComponent } from './views/categorias/entretenimiento/dia-de-sol/dia-de-sol.component';
import { DiscotecasParchesComponent } from './views/categorias/entretenimiento/discotecas-parches/discotecas-parches.component';
import { FincasSalonesComponent } from './views/categorias/entretenimiento/fincas-salones/fincas-salones.component';
import { DrogueriasOpticasComponent } from './views/categorias/salud/droguerias-opticas/droguerias-opticas.component';
import { EpsHospitalesComponent } from './views/categorias/salud/eps-hospitales/eps-hospitales.component';
import { MedicosOdontologosComponent } from './views/categorias/salud/medicos-odontologos/medicos-odontologos.component';
import { NaturistasFisioterapiasComponent } from './views/categorias/salud/naturistas-fisioterapias/naturistas-fisioterapias.component';
import { ClimaComponent } from './views/categorias/entretenimiento/clima/clima.component';
import { LoginComponent } from './views/login/login.component';
import { UserFeedComponent } from './views/consumer/user-feed/user-feed.component';
import { CarruselComponent } from './components/build/carrusel/carrusel.component';
import { EventosComponent } from './views/categorias/entretenimiento/eventos/eventos.component';
import { MarranitoComponent } from './views/marranito/marranito.component';
import { AlimentosComponent } from './views/categorias/alimentos/alimentos/alimentos.component';
import { ComerciosComponent } from './views/categorias/comercios/comercios/comercios.component';
import { ServiciosComponent } from './views/categorias/servicios/servicios/servicios.component';
import { EntretenimientoComponent } from './views/categorias/entretenimiento/entretenimiento/entretenimiento.component';
import { SaludComponent } from './views/categorias/salud/salud/salud.component';
import { OnboardingNegocioRegistroComponent } from './views/onboarding-negocio-registro/onboarding-negocio-registro.component'; // <-- IMPORTADO
import { PerfilNegocioEditorComponent } from './views/perfil-negocio-editor/perfil-negocio-editor.component';


export const routes: Routes = [
    // 1. RUTAS DE ENTRADA Y PRINCIPALES
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'intro', component: IntroComponent },
    { path: 'registro', component: RegistarNegociosComponent },
    { path: 'onboarding-negocio-registro', component: OnboardingNegocioRegistroComponent }, // <-- RUTA AÑADIDA
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
    {
        path: 'perfil-negocio-editor', component: PerfilNegocioEditorComponent
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
