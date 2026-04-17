
import { AlimentosData } from "./tarjetasData";


// Interface de las categorias
export interface CategoriasInterface { icono: string;  ruta: string;  seccion?: SeccionInterface[]; tarjetas?: TarjetaInterface[]; }

export interface TarjetaInterface {    image: string;    patrocinador: string;}

// Interface para las Secciones dentro de las Categorias
export interface SeccionInterface { seccion?: string;  ruta?: string; icono: string; }

// Data estática para alimentar los botones de navegación de la app.
export const categoriaData: CategoriasInterface[] = [



    // . Alimentos
    {                 
        icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif',
        ruta: 'Alimentoss',
        tarjetas: AlimentosData,
        seccion: [  
            
            {  
                ruta:'Comida Rápida', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Restaurantes', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Pizzerias', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Heladerias', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Postres', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Cafeterias', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Supermercados',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Plaza de Mercado', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Carnicerias', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Legumbrerias - Fruvers', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },   
            {  
                ruta:'Panaderias', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Reposterias',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Salmamentarias',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Asaderos',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            }
        ],
          
    },

    // . Comercios
    {                 
        icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif',
        ruta: 'Comercios',
        tarjetas: [
            {
                image: 'https://img.freepik.com/foto-gratis/feliz-mujer-cajera-escaneando-articulos-supermercado_171337-2418.jpg?t=st=1740799104~exp=1740802704~hmac=11147176a4b3216d0adc70c36a0f6b0ea0f92b4796033d80f19bcd5c025a2ddf&w=1060', 
                patrocinador: 'Copacarnes'},
            {
                image: 'https://img.freepik.com/foto-gratis/mujeres-sonrientes-tiro-medio-dispositivos_23-2149081077.jpg?t=st=1740799116~exp=1740802716~hmac=be16fc93e77a18e340a390c3fcd01e9e9391a42a9c5ffa6f643d28d92264eeef&w=1060', 
                patrocinador: ''},
            {
                image: 'https://img.freepik.com/foto-gratis/peso-vendedor-productos-frescos-comprador_482257-87223.jpg?t=st=1740799123~exp=1740802723~hmac=6fb20f09ebf1688f1abe6f7738b3e236f28016f5366536352aedf420fa137cb5&w=1380', 
                patrocinador: ''}
        ],
        seccion: [  
            { 
                ruta:'Hogar', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Celulares y PC', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Tecnología',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Cosméticos', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Ropa', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Calzado', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Papelerías y librerias', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Tiendas de Sentimientos', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Joyerias', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Repuestos', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Ferreterías', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },   
            {  
                ruta:'Agropecuarias', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Tienda de Mascotas',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Accesorios Dama',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Cacharrería',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Misceláneas',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Desechables',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Lencería Hogar',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            }
            ,
            {
                ruta: 'Deportes',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            }
            ,
            {
                ruta: 'Fabricas',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            }
        ],
          
    },

    // . Servicios
    {                 
        icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif',
        ruta: 'Servicios',
        tarjetas: [
            {
                image: 'https://img.freepik.com/foto-gratis/fajita-pollo-filete-pollo-frito-pimiento-lavash-rebanadas-pan-plato-blanco_114579-174.jpg?t=st=1740849530~exp=1740853130~hmac=53b80a6432dc0572167ad1718356747ba1afb67a8c5c6b6b5d4fc42bf06bee08&w=740', 
                patrocinador: 'Copacarnes'},
            {
                image: 'https://img.freepik.com/foto-gratis/verduras-saludables-mesa-madera_1150-38014.jpg?t=st=1740798849~exp=1740802449~hmac=281f6bff6b7fbd90acf7142574f83ab724799fd2e5faf5b38a4f074deda76db1&w=1060', 
                patrocinador: ''},
            {
                image: 'https://img.freepik.com/fotos-premium/flay-pone-comestibles-especias_23-2148262136.jpg?w=1060', 
                patrocinador: ''}
        ],
        seccion: [  
            {  
                ruta:'Belleza y Spa', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },  
            { 
                ruta:'Domicilios', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            { 
                ruta:'Taxistas', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            { 
                ruta:'Transporte y Acarreos', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Construcción', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Talleres Automotrices', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Talleres de Motos', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Barberias',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Peluquerias Caninas',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Cerrajería',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Mecánicos y Electricos',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Autolavados',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Herrería',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Repuestos Ciclas',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Publicidad',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Encomiendas',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Eventos y Decoración',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'CDA y SOAT',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Escuelas de Conducción',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Inmobiliarias',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Parqueaderos',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Profesionales Independientes',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            }
        ],
          
    },

    // . Entretenimiento
    {                 
        icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif',
        ruta: 'Entretenimiento',
        tarjetas: [
            {
                image: 'https://img.freepik.com/foto-gratis/fajita-pollo-filete-pollo-frito-pimiento-lavash-rebanadas-pan-plato-blanco_114579-174.jpg?t=st=1740849530~exp=1740853130~hmac=53b80a6432dc0572167ad1718356747ba1afb67a8c5c6b6b5d4fc42bf06bee08&w=740', 
                patrocinador: 'Copacarnes'},
            {
                image: 'https://img.freepik.com/foto-gratis/verduras-saludables-mesa-madera_1150-38014.jpg?t=st=1740798849~exp=1740802449~hmac=281f6bff6b7fbd90acf7142574f83ab724799fd2e5faf5b38a4f074deda76db1&w=1060', 
                patrocinador: ''},
            {
                image: 'https://img.freepik.com/fotos-premium/flay-pone-comestibles-especias_23-2148262136.jpg?w=1060', 
                patrocinador: ''}
        ],
        seccion: [  
            
            { 
                ruta:'Día de Sol', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Discotecas', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Fincas para Eventos', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Fondas y Parches', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Diversion Extrema', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },  
            {  
                ruta:'Senderismo', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },  
            {  
                ruta:'Deportes', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            } ,  
            {  
                ruta:'Billares', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            }                 
             
        ],
          
    },

    // . Salud
    {                 
        icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif',
        ruta: 'Salud',
        tarjetas: [
            {image: 'https://img.freepik.com/foto-gratis/banner-medico-estetoscopio_23-2149611199.jpg?ga=GA1.1.222355279.1747401779&semt=ais_hybrid&w=740', 
                patrocinador: 'Copacarnes'},
            {image: 'https://img.freepik.com/foto-gratis/joven-medico-guapo-tunica-medica-estetoscopio_1303-17818.jpg?ga=GA1.1.222355279.1747401779&semt=ais_hybrid&w=740', 
                patrocinador: ''},
            {image: 'https://img.freepik.com/foto-gratis/retrato-sonriente-joven-medicos-posicion-juntos-retrato-personal-medico-dentro-moderno-hospital-sonriente-camara_657921-885.jpg?ga=GA1.1.222355279.1747401779&semt=ais_hybrid&w=740', 
                patrocinador: ''}
        ],
        seccion: [  
            { 
                ruta:'Droguerías', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Opticas', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'EPS y hospitales', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Odontólogos', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },{  
                ruta:'Medicos', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Fisioterapia', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Enfermeras', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            }                    
             
        ],
          
    },

    // . Comunidad
    {                 
        icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif',
        ruta: 'Comunidad',
        seccion: [  
            { 
                ruta:'Comunicados', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Deportes', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Cultura', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Instituciones', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Trámites Institucionales', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Bancos y Coperativas',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Parroquias',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Comunicados Religiosos',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            }
        ],
          
    },

    // . Oportunidades
    {                 
        icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif',
        ruta: 'Oportunidades',
        seccion: [  
            { 
                ruta:'Ofertas', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            { 
                ruta:'Promociones', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Clasificados', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Marketplace', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Ventas a Crédito', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Ventas por Revistas', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Museo Digital', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            }                
             
        ],
          
    },

    // . Inmuebles
    {                 
        icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif',
        ruta: 'Inmuebles',
        seccion: [  
            { 
                ruta:'Casas', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Apartamentos', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Locales y Oficinas', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Lotes', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Aparta Estudios', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Habitaciones', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            }                        
             
        ],
          
    },

    // . Educacion
    {                 
        icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif',
        ruta: 'Educación',
        seccion: [  
            { 
                ruta:'Colegios', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Universidades', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Cursos y talleres', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Apoyo Escolar', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Teso IA', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Bibliotecas', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            }
 
        ],
          
    },

   // . Pasatiempos
    {                 
        icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif',
        ruta: 'Pasatiempos',
        seccion: [  
            { 
                ruta:'Horóscopo', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Chistes', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Sopa de Letras', 
                icono:'https://i.pinimg.com/originals/70/a5_52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Crucigramas', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Poesia', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            }
             
        ],
          
    },

    // . Noticias
    {                 
        icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif',
        ruta: 'Noticias',
        seccion: [  
            { 
                ruta:'Deportes', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Educación y Tecnologia', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Economia', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Entretenimiento', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Salud', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Politica', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            }
             
        ],
          
    },
];
