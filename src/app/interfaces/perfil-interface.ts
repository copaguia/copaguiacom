import { RolUsuario } from "../core/auth/rol-usuario";


export interface PerfilInterface {
  id               : string;
  nombreUsuario    : string;
  email            : string;
  nombreMostrado?  : string;
  urlFoto?         : string;
  biografia?       : string;
  ultimaActividad? : string;
  fechaCreacion    : string;
  rolUsuario?      : RolUsuario;
  activo?          : boolean;
}


