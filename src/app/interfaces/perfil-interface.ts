export enum RolUsuario {
  VISITANTE = 'visitante',
  USUARIO = 'usuario',
  ADMIN = 'admin',
  SOPORTE = 'soporte'
}


export interface PerfilInterface {
  id: string; 
  nombreUsuario: string; 
  email: string; 
  nombreMostrado?: string; 
  urlFoto?: string; 
  biografia?: string; 
  ultimaActividad?: string; 
  fechaCreacion: string; 
  rolUsuario?: RolUsuario;
}
