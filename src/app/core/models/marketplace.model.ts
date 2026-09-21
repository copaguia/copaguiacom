export interface MarketplaceItem {
  id: string;
  titulo: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
  vendedorId: string;
  ubicacion: string;
  condicion: 'Nuevo' | 'Usado' | 'Reacondicionado';
  fechaPublicacion: string;
  estado: 'disponible' | 'vendido' | 'oculto';
}
