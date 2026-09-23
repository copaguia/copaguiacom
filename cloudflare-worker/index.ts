export interface Env {
  // Variables de entorno de Cloudflare
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const hostname = url.hostname;

    let tenantId = 'default';
    if (hostname.includes('copaguia.com')) {
      tenantId = 'copaguia';
    } else if (hostname.includes('niquia.com')) {
      tenantId = 'niquia';
    } else if (hostname.includes('elhueco.online')) {
      tenantId = 'elhueco';
    }

    const newHeaders = new Headers(request.headers);
    newHeaders.set('x-tenant-id', tenantId);
    // CRÍTICO: Firebase usa la cabecera 'Host' para saber qué sitio mostrar. 
    // Debemos sobrescribirla para que coincida con el proxy, de lo contrario Firebase fallará de nuevo.
    newHeaders.set('Host', 'directorio-paisa.web.app');

    // Reescribimos el destino hacia el proyecto base de Firebase para que Firebase no lo rechace
    const proxyUrl = new URL(request.url);
    proxyUrl.hostname = 'directorio-paisa.web.app';

    const modifiedRequest = new Request(proxyUrl.toString(), {
      headers: newHeaders,
      method: request.method,
      body: request.body,
      redirect: request.redirect
    });

    const response = await fetch(modifiedRequest);
    const newResponse = new Response(response.body, response);
    // newResponse.headers.set('x-worker-debug', 'executed-multitenant');
    return newResponse;
  },
};
