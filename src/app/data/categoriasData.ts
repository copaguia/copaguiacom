
// Interface de las categorias
export interface CategoriasInterface { icono: string; ruta: string; seccion?: SeccionInterface[]; tarjetas?: TarjetaInterface[]; }
export interface SeccionInterface { seccion?: string; ruta?: string; icono: string; }
export interface TarjetaInterface { image: string; patrocinador: string; }




// Data estática para alimentar los botones de navegación de la app.
export const categoriaData: CategoriasInterface[] = [



    // . Alimentos
    {
        icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif',
        ruta: 'Alimentos',        
        seccion: [

            {
                ruta: 'Comida Rápida',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Restaurantes',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Pizzerias',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Heladerias',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Postres',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Cafeterias',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Supermercados',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Plaza de Mercado',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Carnicerias',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Legumbrerias - Fruvers',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Panaderias',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
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
        seccion: [
            {
                ruta: 'Hogar',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Celulares y Tecnologia',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },

            {
                ruta: 'Cosméticos',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Ropa',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Calzado',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Papelerías y librerias',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Tiendas de Sentimientos',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Joyerias',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Repuestos',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Ferreterías',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Agropecuarias',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
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
        seccion: [
            {
                ruta: 'Belleza y Spa',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Domicilios',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Taxistas',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Transporte y Acarreos',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Construcción',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Talleres Automotrices',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Talleres de Motos',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
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
        seccion: [

            {
                ruta: 'Día de Sol',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Discotecas',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Fincas para Eventos',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Fondas y Parches',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Diversion Extrema',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Senderismo',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Deportes',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Billares',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            }

        ],

    },

    // . Salud
    {
        icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif',
        ruta: 'Salud',
        tarjetas: [
            {
                image: 'https://img.freepik.com/foto-gratis/banner-medico-estetoscopio_23-2149611199.jpg?ga=GA1.1.222355279.1747401779&semt=ais_hybrid&w=740',
                patrocinador: 'Copacarnes'
            },
            {
                image: 'https://img.freepik.com/foto-gratis/joven-medico-guapo-tunica-medica-estetoscopio_1303-17818.jpg?ga=GA1.1.222355279.1747401779&semt=ais_hybrid&w=740',
                patrocinador: ''
            },
            {
                image: 'https://img.freepik.com/foto-gratis/retrato-sonriente-joven-medicos-posicion-juntos-retrato-personal-medico-dentro-moderno-hospital-sonriente-camara_657921-885.jpg?ga=GA1.1.222355279.1747401779&semt=ais_hybrid&w=740',
                patrocinador: ''
            }
        ],
        seccion: [
            {
                ruta: 'Droguerías',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Opticas',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'EPS y hospitales',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Odontólogos',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            }, {
                ruta: 'Medicos',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Fisioterapia',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Enfermeras',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            }

        ],

    },

    /** cominidad
    {
        icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif',
        ruta: 'Comunidad',
        seccion: [
          {
                ruta: 'Parroquias',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
          
            {
                ruta: 'Comunicados',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Deportes',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Cultura',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
                                 
            

        ],

    },*/
 
    /** . Oportunidades 
    {
        icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif',
        ruta: 'Oportunidades',
        seccion: [

            {
                ruta: 'Clasificados',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Marketplace',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },


        ],

    },*/

    /*. Inmuebles
    {
        icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif',
        ruta: 'Inmuebles',
        seccion: [
            {
                ruta: 'Casas',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Apartamentos',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Locales y Oficinas',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Lotes',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Aparta Estudios',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Habitaciones',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            }

        ],

    },*/ 

    // . Educacion
    {
        icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif',
        ruta: 'Educación',
        seccion: [
            {
                ruta: 'Colegios',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Universidades',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Cursos y talleres',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            {
                ruta: 'Apoyo Escolar',
                icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'
            },
            //{ ruta: 'Teso IA', icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'    },
            //{ ruta: 'Bibliotecas', icono: 'https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif'  }

        ],

    },

    /* . Pasatiempos
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
           
     },*/

    /* . Noticias
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
          
    },*/
];
