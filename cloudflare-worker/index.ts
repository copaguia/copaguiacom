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

    const modifiedRequest = new Request(request, {
      headers: newHeaders
    });

    return fetch(modifiedRequest);
  },
};
