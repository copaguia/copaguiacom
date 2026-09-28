import axios from 'axios';

export interface ParametrosExtraccionNegocios {
  terminosBusqueda: string[];
  ubicacionTexto:   string;
  limiteResultados: number;
  tenantId:         string;
  webhookUrl:       string;
}

export async function dispararExtractorApify(
  parametros: ParametrosExtraccionNegocios,
  tokenApify: string,
  actorId:    string = 'compass~crawler-google-places'
): Promise<{ idEjecucion: string; idDataset: string }> {
  const urlApi  = `https://api.apify.com/v2/acts/\({actorId}/runs?token=\){tokenApify}`;
  const payload = {
    searchStringsArray: parametros.terminosBusqueda,
    locationQuery:      parametros.ubicacionTexto,
    maxCrawledPlaces:   parametros.limiteResultados,
    webhooks: [
      {
        eventTypes: ['ACTOR.RUN.SUCCEEDED'],
        requestUrl: parametros.webhookUrl,
        payloadTemplate: JSON.stringify({
          tenantId: parametros.tenantId,
          data:     '{{resource.defaultDataset}}'
        })
      }
    ]
  };

  const respuesta = await axios.post(urlApi, payload);
  const datos     = respuesta.data.data;

  return {
    idEjecucion: datos.id,
    idDataset:   datos.defaultDatasetId
  };
}