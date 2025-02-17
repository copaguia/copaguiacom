export interface CategoriaInterface {
    nombre: string;
    seccion?: SeccionInterface[];
}

export interface SeccionInterface {
    nombre: string;
    ruta: string;
    icono: string;
}
