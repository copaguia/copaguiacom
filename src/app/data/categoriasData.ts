/*
    En esta constante se cumple EMA ( Estrategia Modular Autónoma); 
    tanto la interface de las Categorias como la interface de lñas Secciones estan 
    incorporadas dentro del fichero, anulando la dependencia de otros servicios o componentes para
    construir la Data Estática para el proyecto.

*/

import { Input } from "@angular/core";

// Interface de las categorias
export interface CategoriasInterface {
    nombreCategoria: string;
    icono: string;
    ruta: string;
    seccion?: SeccionInterface[]; // No es estrictamente necesaria al usarlo colo como categoria.

}

// Interface para las Secciones dentro de las Categorias
export interface SeccionInterface {
    nombre: string;
    ruta: string;
    icono: string;
}

// Data estática para alimentar los botones de navegación de la app.
export const categoriaData: CategoriasInterface[] = [
    {         
        nombreCategoria: 'Alimentos', 
        icono: '',
        ruta: '',
        seccion: [  
            { 
                nombre: 'Comida Rapida', 
                ruta:'comida-rapida', 
                icono:'assets/iconos/ahorros.gif'
            },
            { 
                nombre: 'Pizzerias', 
                ruta:'carniceria', 
                icono:''
            } ,
            { 
                nombre: 'Comida Rápida', 
                ruta:'legumbrerias', 
                icono:''
            }            
          ],
    },
    {         
        nombreCategoria: 'Salud', 
        icono: '',
        ruta: '',
        seccion: [  
            { 
                nombre: 'Clinicas', 
                ruta:'clinicas', 
                icono:'assets/iconos/ahorros.gif'
            },
            { 
                nombre: 'Droguerias', 
                ruta:'droguerias', 
                icono:''
            } ,
            { 
                nombre: 'Odontólogos', 
                ruta:'odontologos', 
                icono:''
            }            
          ],
    },
    {         
        nombreCategoria: 'Servicios', 
        icono: 'https://firebasestorage.googleapis.com/v0/b/copaguia-53f7f.appspot.com/o/iconos%2Fbanco.gif?alt=media&token=127ae0a3-b283-411f-9c0d-55003c6b3374',
        ruta: '',
        seccion: [  
            { 
                nombre: 'Transporte', 
                ruta:'transporte', 
                icono:''
            },
            { 
                nombre: 'Plomeros', 
                ruta:'plomeros', 
                icono:''
            },
            { 
                nombre: 'Mecánicos', 
                ruta:'mecanicos', 
                icono:''
            } ,
            { 
                nombre: 'Carpinteros', 
                ruta:'carpinteros', 
                icono:''
            } ,

             
          ],
    },
    {         
        nombreCategoria: 'Entretenimiento', 
        icono: 'https://firebasestorage.googleapis.com/v0/b/copaguia-53f7f.appspot.com/o/iconos%2Fbanco.gif?alt=media&token=127ae0a3-b283-411f-9c0d-55003c6b3374',
        ruta: '',
        seccion: [  
            { 
                nombre: 'Parques', 
                ruta:'parques', 
                icono:''
            },
            { 
                nombre: 'Paseos', 
                ruta:'paseos', 
                icono:''
            },
            { 
                nombre: 'Fincas', 
                ruta:'fincas', 
                icono:''
            } ,
            

             
          ],

          
    },

    {         
        nombreCategoria: 'Comunidad', 
        icono: 'https://firebasestorage.googleapis.com/v0/b/copaguia-53f7f.appspot.com/o/iconos%2Fbanco.gif?alt=media&token=127ae0a3-b283-411f-9c0d-55003c6b3374',
        ruta: '',
        seccion: [  
            { 
                nombre: 'Entes Públicos', 
                ruta:'entes', 
                icono:''
            },
            { 
                nombre: 'Iglesias', 
                ruta:'iglesias', 
                icono:''
            },
            { 
                nombre: 'Bomberos', 
                ruta:'bomberos', 
                icono:''
            } ,
            

             
          ],

          
    },
    

];

