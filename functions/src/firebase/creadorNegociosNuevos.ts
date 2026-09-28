import * as admin from 'firebase-admin';

export interface DatosNegocioCrudo {
  title?:        string;
  name?:         string;
  categoryName?: string;
  address?:      string;
  phone?:        string;
  website?:      string;
  location?: {
    lat: number;
    lng: number;
  };
  totalScore?:   number;
}

export async function guardarNegociosPorDirectorio(
  negociosCrudos: DatosNegocioCrudo[],
  idDirectorio:   string
) {
  const coleccionNegocios = admin.firestore().collection('Negocios');
  const limiteBatch       = 490;
  let contadorGuardados   = 0;

  for (let indice = 0; indice < negociosCrudos.length; indice += limiteBatch) {
    const loteActual = negociosCrudos.slice(indice, indice + limiteBatch);
    const batch      = admin.firestore().batch();

    for (const item of loteActual) {
      const referenciaDocumento = coleccionNegocios.doc();
      const registroMapeado     = {
        idDirectorio:     idDirectorio,
        nombre:           item.title || item.name || 'Sin nombre comercial',
        categoria:        item.categoryName || 'General',
        direccion:        item.address || '',
        telefono:         item.phone || '',
        sitioWeb:         item.website || '',
        coordenadas:      item.location || null,
        calificacion:     item.totalScore || 0,
        fechaCreacion:    admin.firestore.FieldValue.serverTimestamp(),
        estadoActivacion: 'PENDIENTE_REVISION'
      };

      batch.set(referenciaDocumento, registroMapeado);
      contadorGuardados++;
    }

    await batch.commit();
  } // <-- Cierra el bucle 'for'

  return contadorGuardados; // <-- Debe estar ADENTRO de la función
} // <-- Cierra la función guardarNegociosPorDirectorio
  
