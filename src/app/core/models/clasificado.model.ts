export interface Clasificado {
  id:               string;
  titulo:           string;
  descripcion:      string;
  categoria:        string;
  fechaPublicacion: string;
  precio?:          number;
  contactoTelefono?: string;
  contactoEmail?:   string;
  estado:           'activo' | 'inactivo';
  premium?:         boolean;
  imagen?:          string;
}
