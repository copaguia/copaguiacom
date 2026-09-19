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
    const dnsUrl = `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`;
    const headers  = {
      'Authorization': `Bearer ${config.apiToken}`,
      'Content-Type':  'application/json'
    };

    // Registro CNAME raíz → Firebase Hosting
    await axios.post(dnsUrl, {
      type:    'CNAME',
      name:    '@',
      content: 'copaguia-53f7f.firebaseapp.com',
      proxied: true,
      comment: 'Configurado automáticamente por Copaguia Zero-Touch'
    }, { headers });

    // Registro CNAME www → Firebase Hosting
    await axios.post(dnsUrl, {
      type:    'CNAME',
      name:    'www',
      content: 'copaguia-53f7f.firebaseapp.com',
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
