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

  sexo?            : string;
  fechaNacimiento? : string;
  direccion?       : {
    calle?     : string;
    barrio?    : string;
    municipio? : string;
    detalles?  : string;
  };

  negocioAsociadoId?: string; // ID del negocio si el rol es DUEÑO
  metadatos?: {
    totalPedidos?:  number;
    verificado?:    boolean;
  };
}


