import { Timestamp } from "firebase/firestore";
import { StateEnum } from "../enums/state.enum";


export interface PromocionesInterface {
    id?            : string;
  titulo         : string;
  cuerpo         : string;
  imagenUrl?     : string;
  fecha          : Timestamp;
  expira         : Timestamp;
  estado         : StateEnum; // <--- Uso del Enum Universal
  tipo           : string;
  valorDescuento?: number;
}
