import { PerfilInterface } from "./perfil-interface";

export interface EstadoAuth {
    usuario:      PerfilInterface | null;
    estaCargando: boolean;
    error:        string | null;
  }