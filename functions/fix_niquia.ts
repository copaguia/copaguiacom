import { conectarDominioExistente, crearCustomHostname } from './src/cloudflare/cloudflareDomains';

const config = {
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID as string,
  apiToken: process.env.CLOUDFLARE_API_TOKEN as string
};

const domainName = 'niquia.com';
const hubZoneId = process.env.CLOUDFLARE_HUB_ZONE_ID as string;

async function run() {
  try {
    console.log(`Corrigiendo DNS y Custom Hostname para ${domainName}...`);
    // conectarDominioExistente ahora usará el fallbackOrigin (directoriopaisa.com)
    await conectarDominioExistente(domainName, config);
    console.log(`DNS corregido.`);
    
    console.log(`Verificando/Creando Custom Hostname en la zona Hub...`);
    try {
      await crearCustomHostname(domainName, hubZoneId, config);
      console.log(`Custom Hostname creado.`);
    } catch (e: any) {
      console.log(`El Custom Hostname probablemente ya existe o hubo un error:`, e.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

run();
