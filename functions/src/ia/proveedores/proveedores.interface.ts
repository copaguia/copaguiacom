export interface CumplimientoProveedorInterface {
  camaraComercioVence?: any; // Timestamp de Firestore
  sanitarioVence?: any;      // Timestamp de Firestore
  transporteVence?: any;     // Timestamp de Firestore
  rutUrl?: string;
  fichaUrl?: string;
  [key: string]: any;
}

export interface ProveedorFirestoreDataInterface {
  nombre?: string;
  identificacionFiscal?: string;
  email?: string;
  telefono?: string;
  activo?: boolean;
  cumplimiento?: CumplimientoProveedorInterface;
  [key: string]: any;
}

export interface ProveedorIncompletoAuditoriaInterface {
  id: string;
  nombre: string;
  nit: string;
  email: string;
  telefono: string;
  faltantes: string[];
}
