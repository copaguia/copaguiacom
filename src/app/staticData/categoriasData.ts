import { CategoriaInterface } from "../interfaces/categoria-interface";

export const categoriaData: CategoriaInterface[] = [
    {         
        nombre: 'Alimentos', 
        seccion: [  
            { 
                nombre: 'Comida Rapida', 
                ruta:'comida-rapida', 
                icono:''
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
        nombre: 'Servicios', 
        seccion: [  
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

];