export interface RankingValidadorInterface {
  posicion:    number;
  uid:         string;
  nombre:      string;
  email:       string;
  rol:         string;
  total:       number;
  porcentaje:  number;
  ultimaFecha: string;
  urlFoto?:    string;
}

export interface RankingRolInterface {
  posicion:         number;
  rol:              string;
  total:            number;
  porcentaje:       number;
  totalValidadores: number;
  ultimaFecha:      string;
}
