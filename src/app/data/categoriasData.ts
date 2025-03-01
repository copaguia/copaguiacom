/*
    En esta constante se cumple EMA ( Estrategia Modular Autónoma); 
    tanto la interface de las Categorias como la interface de lñas Secciones estan 
    incorporadas dentro del fichero, anulando la dependencia de otros servicios o componentes para
    construir la Data Estática para el proyecto.

*/

import { BannerInterface } from "../components/carrusel/carrusel.component";


// Interface de las categorias
export interface CategoriasInterface {
    icono: string;
    ruta: string;
    seccion?: SeccionInterface[]; // No es estrictamente necesaria al usarlo colo como categoria.
    tarjetas?: BannerInterface[];

}

export interface TarjetaInterface {
    image: string;
    patrocinador: string;
}

// Interface para las Secciones dentro de las Categorias
export interface SeccionInterface {
    ruta: string;
    icono: string;
}

// Data estática para alimentar los botones de navegación de la app.
export const categoriaData: CategoriasInterface[] = [



    // . Alimentos
    {                 
        icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif',
        ruta: 'Alimentos',
        tarjetas: [
            {image: 'https://img.freepik.com/foto-gratis/vista-superior-surtido-piramide-alimentos-reales_23-2150238927.jpg?t=st=1740798804~exp=1740802404~hmac=68e778858fa838b50827871ecb0db79d593c8203fdc1306139825d216e9d85fb&w=1060', 
                patrocinador: 'Copacarnes'},
            {image: 'https://img.freepik.com/foto-gratis/verduras-saludables-mesa-madera_1150-38014.jpg?t=st=1740798849~exp=1740802449~hmac=281f6bff6b7fbd90acf7142574f83ab724799fd2e5faf5b38a4f074deda76db1&w=1060', 
                patrocinador: ''},
            {image: 'https://img.freepik.com/fotos-premium/flay-pone-comestibles-especias_23-2148262136.jpg?w=1060', 
                patrocinador: ''}
        ],
        seccion: [  
            { 
                ruta:'Domicilios', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Comida Rápida', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Restaurante y Pizzas', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Helados y postres', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Cafés y Parva', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Supermercados', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Plaza de Mercado', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Carnicerias y Legumbrerias', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },            
             
        ],
          
    },

    // . Comercios
    {                 
        icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif',
        ruta: 'Comercios',
        tarjetas: [
            {image: 'https://img.freepik.com/foto-gratis/feliz-mujer-cajera-escaneando-articulos-supermercado_171337-2418.jpg?t=st=1740799104~exp=1740802704~hmac=11147176a4b3216d0adc70c36a0f6b0ea0f92b4796033d80f19bcd5c025a2ddf&w=1060', 
                patrocinador: 'Copacarnes'},
            {image: 'https://img.freepik.com/foto-gratis/mujeres-sonrientes-tiro-medio-dispositivos_23-2149081077.jpg?t=st=1740799116~exp=1740802716~hmac=be16fc93e77a18e340a390c3fcd01e9e9391a42a9c5ffa6f643d28d92264eeef&w=1060', 
                patrocinador: ''},
            {image: 'https://img.freepik.com/foto-gratis/peso-vendedor-productos-frescos-comprador_482257-87223.jpg?t=st=1740799123~exp=1740802723~hmac=6fb20f09ebf1688f1abe6f7738b3e236f28016f5366536352aedf420fa137cb5&w=1380', 
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
                ruta:'Cosméticos', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Moda y Calzado', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Papelerías y librerias', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Regalos y joyas', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Repuestos', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Ferreterías y Agropecuarias', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },            
             
        ],
          
    },

    // . Servicios
    {                 
        icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif',
        ruta: 'Servicios',
        seccion: [  
            { 
                ruta:'Transporte', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Hogar y oficina', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Construcción', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Automotrices', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Logística y eventos', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Belleza y Spa', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            }                      
             
        ],
          
    },

    // . Entretenimiento
    {                 
        icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif',
        ruta: 'Entretenimiento',
        seccion: [  
            { 
                ruta:'Día de Sol', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Parches y discotecas', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Eventos', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Fincas y salones', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            }                    
             
        ],
          
    },

    // . Salud
    {                 
        icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif',
        ruta: 'Salud',
        seccion: [  
            { 
                ruta:'Droguerías y opticas', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'EPS y hospitales', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Médicos y Odontólogos', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Naturistas y fisioterapias', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            }                    
             
        ],
          
    },

    // . Oportunidades
    {                 
        icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif',
        ruta: 'Oportunidades',
        seccion: [  
            { 
                ruta:'Ofertas y promociones', 
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
            }                    
             
        ],
          
    },

    // . Comunidad
    {                 
        icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif',
        ruta: 'Comunidad',
        seccion: [  
            { 
                ruta:'Notificaciones', 
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
                ruta:'Trámites', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Religión', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
             
        ],
          
    },

    // . Educación
    {                 
        icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif',
        ruta: 'Educación',
        seccion: [  
            { 
                ruta:'Bibliotecas', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
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
                ruta:'Investigación ', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Teso IA', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
             
        ],
          
    },




    // . Pasatiempos
    {                 
        icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif',
        ruta: 'Pasatiempos',
        seccion: [  
            { 
                ruta:'Hróscopo', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Chistes', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Sopa de Letras', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Crucigramas', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Poesia', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {  
                ruta:'Juegos', 
                icono:'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
             
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
                ruta:'Politica', 
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
             
        ],
          
    },

];

