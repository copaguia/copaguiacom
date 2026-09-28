import { AxiosInstance } from 'axios';
import { CloudflareConfig } from '../interfaces/cloudflareconfig.interface';
import { CloudflareDominio } from './dominio.interface';
import { crearClienteCloudflare } from './coneccionAxiosCloudlfare';

export async function listarDominiosRegistrados(config: CloudflareConfig) {
  const cliente: AxiosInstance = crearClienteCloudflare(config);
  try {
    const respuesta = await cliente.get(`/accounts/${config.accountId}/registrar/domains`);
    const dominios: CloudflareDominio[] = (respuesta.data.result || []).map((d: any) => ({
      nombre:     d.name,
      expiracion: d.expires_at,
      autoRenew:  d.auto_renew,
      estado:     d.status
    }));

    return dominios;
  } catch (error: any) {
    console.error('Error listando dominios Cloudflare:', error.response?.data || error.message);
    throw new Error('Fallo al obtener dominios de Cloudflare');
  }
}

export async function comprarDominio(domainName: string, config: CloudflareConfig) {
  const cliente: AxiosInstance = crearClienteCloudflare(config);
  try {
    const payload = {
      name:       domainName,
      auto_renew: true,
      years:      1
    };

    const respuesta = await cliente.post(`/accounts/${config.accountId}/registrar/domains`, payload);
    return respuesta.data;
  } catch (error: any) {
    console.error('Error comprando dominio en Cloudflare:', error.response?.data || error.message);
    throw new Error('Fallo al comprar dominio en Cloudflare');
  }
}

export async function conectarDominioExistente(domainName: string, config: CloudflareConfig) {
  const cliente: AxiosInstance = crearClienteCloudflare(config);
  try {
    const respuestaZonas = await cliente.get(`/zones?name=\({domainName}&account.id=\){config.accountId}`);
    const zonas          = respuestaZonas.data.result;

    if (!zonas || zonas.length === 0) {
      throw new Error(`No se encontró la zona para el dominio ${domainName} en tu cuenta Cloudflare`);
    }

    const zoneId = zonas[0].id;
    console.log(`✅ Zona encontrada para \({domainName}:\){zoneId}`);

    await configurarDNSCloudflare(zoneId, domainName, config);
    await asignarWorkerRoute(zoneId, domainName, config);

    return zoneId;
  } catch (error: any) {
    console.error('Error conectando dominio existente:', error.response?.data || error.message);
    throw new Error(`Fallo al conectar \({domainName}:\){error.message}`);
  }
}

export async function configurarDNSCloudflare(zoneId: string, domainName: string, config: CloudflareConfig) {
  const cliente: AxiosInstance = crearClienteCloudflare(config);
  try {
    await cliente.post(`/zones/${zoneId}/dns_records`, {
      type:    'A',
      name:    '@',
      content: '192.0.2.1',
      proxied: true,
      comment: 'Configurado automáticamente por Copaguia'
    });

    console.log(`✅ Registro A (192.0.2.1 proxied) creado para ${domainName}`);
  } catch (error: any) {
    if (error.response?.data?.errors?.[0]?.code === 81053) {
      console.log(`ℹ️ Registro DNS ya existía para ${domainName}, omitiendo.`);
      return;
    }
    console.error('Error configurando DNS Cloudflare:', error.response?.data || error.message);
    throw new Error('Fallo al configurar DNS en Cloudflare');
  }
}

export async function verificarDisponibilidadDominio(domainName: string, config: CloudflareConfig) {
  const cliente: AxiosInstance = crearClienteCloudflare(config);
  try {
    const respuesta = await cliente.post(`/accounts/${config.accountId}/registrar/domains/search`, { name: domainName });
    const result    = respuesta.data.result;

    return {
      disponible: result?.available || false,
      precio:     result?.price || 0,
      moneda:     result?.currency || 'USD'
    };
  } catch (error: any) {
    console.error('Error verificando disponibilidad en Cloudflare:', error.response?.data || error.message);
    throw new Error('Fallo al verificar disponibilidad del dominio en Cloudflare');
  }
}

export async function crearCustomHostname(tenantDomain: string, hubZoneId: string, config: CloudflareConfig) {
  const cliente: AxiosInstance = crearClienteCloudflare(config);
  try {
    const respuesta = await cliente.post(`/zones/${hubZoneId}/custom_hostnames`, {
      hostname: tenantDomain,
      ssl: {
        method: 'http',
        type:   'dv'
      }
    });

    return respuesta.data.result;
  } catch (error: any) {
    console.error('Error creando Custom Hostname:', error.response?.data || error.message);
    throw new Error(`Fallo al crear Custom Hostname para ${tenantDomain}`);
  }
}

export async function asignarWorkerRoute(zoneId: string, domainName: string, config: CloudflareConfig) {
  const cliente: AxiosInstance = crearClienteCloudflare(config);
  try {
    const payload = {
      pattern: `*${domainName}/*`,
      script:  'firebase-mask'
    };

    const respuesta = await cliente.post(`/zones/${zoneId}/workers/routes`, payload);
    console.log(`✅ Worker 'firebase-mask' asignado a la ruta *${domainName}/*`);
    return respuesta.data;
  } catch (error: any) {
    if (error.response?.data?.errors?.[0]?.code === 10020) {
      console.log(`ℹ️ La ruta del Worker ya estaba asignada para ${domainName}, omitiendo.`);
      return;
    }
    console.error('Error asignando Worker Route en Cloudflare:', error.response?.data || error.message);
    throw new Error(`Fallo al asignar Worker a ${domainName}`);
  }
}

export async function crearSubdominio(tenantDomain: string, hubZoneId: string, config: CloudflareConfig) {
  const cliente: AxiosInstance = crearClienteCloudflare(config);
  try {
    const payload = {
      type:    'CNAME',
      name:    tenantDomain,
      content: 'directoriopaisa.com',
      proxied: true,
      comment: 'Subdominio Zero-Cost creado automáticamente'
    };

    const respuesta = await cliente.post(`/zones/${hubZoneId}/dns_records`, payload);
    console.log(`✅ Subdominio CNAME creado: ${tenantDomain}`);
    return respuesta.data.result;
  } catch (error: any) {
    if (error.response?.data?.errors?.[0]?.code === 81053) {
      console.log(`ℹ️ El subdominio ya existía en DNS: ${tenantDomain}, omitiendo.`);
      return;
    }
    console.error('Error creando subdominio:', error.response?.data || error.message);
    throw new Error(`Fallo al crear subdominio para ${tenantDomain}`);
  }
}