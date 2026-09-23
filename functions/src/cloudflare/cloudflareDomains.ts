import axios from 'axios';

// Interfaces
export interface CloudflareConfig {
  accountId: string;
  apiToken:  string;
}

export interface CloudflareDominio {
  nombre:     string;
  expiracion: string;
  autoRenew:  boolean;
  estado:     string;
}

/**
 * Lista todos los dominios registrados en la cuenta Cloudflare Registrar.
 * Retorna solo los campos necesarios para el selector del Dev Dashboard.
 */
export async function listarDominiosRegistrados(config: CloudflareConfig): Promise<CloudflareDominio[]> {
  try {
    const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/registrar/domains`;
    const response = await axios.get(url, {
      headers: { 'Authorization': `Bearer ${config.apiToken}` }
    });

    const dominios: CloudflareDominio[] = (response.data.result || []).map((d: any) => ({
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

/**
 * Registra un NUEVO dominio usando Cloudflare Registrar (lo compra).
 * Requiere método de pago pre-configurado en la cuenta Cloudflare.
 * @param domainName Nombre del dominio (ej. guianiquia.com)
 * @param config Configuración con Token y Account ID
 */
export async function comprarDominio(domainName: string, config: CloudflareConfig) {
  try {
    const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/registrar/domains`;

    const payload = {
      name:       domainName,
      auto_renew: true,
      years:      1
    };

    const response = await axios.post(url, payload, {
      headers: {
        'Authorization': `Bearer ${config.apiToken}`,
        'Content-Type':  'application/json'
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('Error comprando dominio en Cloudflare:', error.response?.data || error.message);
    throw new Error('Fallo al comprar dominio en Cloudflare');
  }
}

/**
 * Conecta un dominio YA EXISTENTE en Cloudflare al proyecto Firebase.
 * Obtiene el Zone ID del dominio existente y configura los registros DNS.
 * Útil para dominios comprados manualmente como niquia.com.
 * @param domainName Nombre del dominio ya registrado (ej. niquia.com)
 * @param config Configuración con Token y Account ID
 */
export async function conectarDominioExistente(domainName: string, config: CloudflareConfig): Promise<string> {
  try {
    // 1. Obtener el Zone ID del dominio existente en la cuenta
    const zonesUrl = `https://api.cloudflare.com/client/v4/zones?name=${domainName}&account.id=${config.accountId}`;
    const zonesRes = await axios.get(zonesUrl, {
      headers: { 'Authorization': `Bearer ${config.apiToken}` }
    });

    const zones = zonesRes.data.result;
    if (!zones || zones.length === 0) {
      throw new Error(`No se encontró la zona para el dominio ${domainName} en tu cuenta Cloudflare`);
    }

    const zoneId = zones[0].id;
    console.log(`✅ Zona encontrada para ${domainName}: ${zoneId}`);

    // 2. Configurar DNS apuntando a Firebase
    await configurarDNSFirebase(zoneId, domainName, config);

    // 3. Asignar ruta de Worker para enmascarar Host
    await asignarWorkerRoute(zoneId, domainName, config);

    return zoneId;
  } catch (error: any) {
    console.error('Error conectando dominio existente:', error.response?.data || error.message);
    throw new Error(`Fallo al conectar ${domainName}: ${error.message}`);
  }
}

/**
 * Configura los registros DNS (CNAME + TXT) en una zona existente apuntando a Firebase Hosting.
 * @param zoneId ID de la zona Cloudflare
 * @param domainName Nombre del dominio
 * @param config Configuración con Token
 */
export async function configurarDNSFirebase(zoneId: string, domainName: string, config: CloudflareConfig) {
  try {
    const fallbackOrigin = 'directoriopaisa.com'; // Fallback Origin para Cloudflare for SaaS
    const dnsUrl = `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`;
    const headers  = {
      'Authorization': `Bearer ${config.apiToken}`,
      'Content-Type':  'application/json'
    };

    // Registro CNAME raíz → Fallback Origin
    await axios.post(dnsUrl, {
      type:    'CNAME',
      name:    '@',
      content: fallbackOrigin,
      proxied: true,
      comment: 'Configurado automáticamente por Copaguia Zero-Touch'
    }, { headers });

    // Registro CNAME www → Fallback Origin
    await axios.post(dnsUrl, {
      type:    'CNAME',
      name:    'www',
      content: fallbackOrigin,
      proxied: true,
      comment: 'www - Configurado automáticamente por Copaguia Zero-Touch'
    }, { headers });

    console.log(`✅ DNS configurado para ${domainName} → Firebase Hosting`);
  } catch (error: any) {
    // Si el registro ya existe (code 81053), no es un error fatal
    if (error.response?.data?.errors?.[0]?.code === 81053) {
      console.log(`ℹ️ DNS ya estaba configurado para ${domainName}, omitiendo.`);
      return;
    }
    console.error('Error configurando DNS en Cloudflare:', error.response?.data || error.message);
    throw new Error('Fallo al configurar DNS');
  }
}

/**
 * Verifica la disponibilidad y precio de un dominio en Cloudflare Registrar.
 * @param domainName Nombre del dominio a buscar (ej. guianiquia.com)
 * @param config Configuración con Token y Account ID
 */
export async function verificarDisponibilidadDominio(domainName: string, config: CloudflareConfig) {
  try {
    const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/registrar/domains/search`;
    const response = await axios.post(url, { name: domainName }, {
      headers: {
        'Authorization': `Bearer ${config.apiToken}`,
        'Content-Type':  'application/json'
      }
    });

    const result = response.data.result;
    return {
      disponible: result.available || false,
      precio: result.price || 0,
      moneda: result.currency || 'USD'
    };
  } catch (error: any) {
    console.error('Error verificando disponibilidad en Cloudflare:', error.response?.data || error.message);
    throw new Error('Fallo al verificar disponibilidad del dominio en Cloudflare');
  }
}

/**
 * Crea un Custom Hostname (Cloudflare for SaaS) en la Zona Hub para un dominio de Tenant.
 * @param tenantDomain El dominio del tenant (ej. guianiquia.com)
 * @param hubZoneId El ID de la zona principal (ej. directoriopaisa.com)
 * @param config Configuración con Token
 */
export async function crearCustomHostname(tenantDomain: string, hubZoneId: string, config: CloudflareConfig) {
  try {
    const url = `https://api.cloudflare.com/client/v4/zones/${hubZoneId}/custom_hostnames`;
    const response = await axios.post(url, {
      hostname: tenantDomain,
      ssl: {
        method: "http",
        type: "dv"
      }
    }, {
      headers: {
        'Authorization': `Bearer ${config.apiToken}`,
        'Content-Type':  'application/json'
      }
    });

    return response.data.result;
  } catch (error: any) {
    console.error('Error creando Custom Hostname:', error.response?.data || error.message);
    throw new Error(`Fallo al crear Custom Hostname para ${tenantDomain}`);
  }
}

/**
 * Asigna la ruta del Worker `firebase-mask` a la zona del dominio
 * para enmascarar la cabecera Host hacia Firebase.
 * @param zoneId ID de la zona Cloudflare del nuevo dominio
 * @param domainName Nombre del dominio (ej. niquia.com)
 * @param config Configuración con Token
 */
export async function asignarWorkerRoute(zoneId: string, domainName: string, config: CloudflareConfig) {
  try {
    const url = `https://api.cloudflare.com/client/v4/zones/${zoneId}/workers/routes`;
    const payload = {
      pattern: `*${domainName}/*`,
      script: 'firebase-mask'
    };

    const response = await axios.post(url, payload, {
      headers: {
        'Authorization': `Bearer ${config.apiToken}`,
        'Content-Type':  'application/json'
      }
    });

    console.log(`✅ Worker 'firebase-mask' asignado a la ruta *${domainName}/*`);
    return response.data;
  } catch (error: any) {
    // Si la ruta ya existe, el código de error suele ser 10020
    if (error.response?.data?.errors?.[0]?.code === 10020) {
      console.log(`ℹ️ La ruta del Worker ya estaba asignada para ${domainName}, omitiendo.`);
      return;
    }
    console.error('Error asignando Worker Route en Cloudflare:', error.response?.data || error.message);
    throw new Error(`Fallo al asignar Worker a ${domainName}`);
  }
}

/**
 * Crea un registro CNAME para un subdominio bajo la zona principal (Hub Zone).
 * @param tenantDomain El subdominio completo (ej. barrioobrero.directoriopaisa.com)
 * @param hubZoneId El ID de la zona principal
 * @param config Configuración con Token
 */
export async function crearSubdominio(tenantDomain: string, hubZoneId: string, config: CloudflareConfig) {
  try {
    const dnsUrl = `https://api.cloudflare.com/client/v4/zones/${hubZoneId}/dns_records`;
    
    // Extraer solo la parte del subdominio (ej: "barrioobrero" de "barrioobrero.directoriopaisa.com")
    // Opcionalmente podemos mandar el nombre completo y CF lo recorta.
    const payload = {
      type: 'CNAME',
      name: tenantDomain,
      content: 'directoriopaisa.com', // El fallback origin o root
      proxied: true,
      comment: 'Subdominio Zero-Cost creado automáticamente'
    };

    const response = await axios.post(dnsUrl, payload, {
      headers: {
        'Authorization': `Bearer ${config.apiToken}`,
        'Content-Type':  'application/json'
      }
    });

    console.log(`✅ Subdominio CNAME creado: ${tenantDomain}`);
    return response.data.result;
  } catch (error: any) {
    if (error.response?.data?.errors?.[0]?.code === 81053) {
      console.log(`ℹ️ El subdominio ya existía en DNS: ${tenantDomain}, omitiendo.`);
      return;
    }
    console.error('Error creando subdominio:', error.response?.data || error.message);
    throw new Error(`Fallo al crear subdominio para ${tenantDomain}`);
  }
}
