export interface NotificacionGlobal {
  id?: string;
  titulo: string;
  mensaje: string;
  tipo: 'promocion' | 'aviso' | 'oferta' | 'urgencia';
  imagenUrl?: string;
  fechaCreacion: string; // ISO 8601 string
  fechaCaducidad: string; // ISO 8601 string
  vistasTotales?: number;
}
