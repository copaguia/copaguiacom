const fs = require('fs');

const tsPath = '/Users/aleo/AngularProjects/directoriopaisa.com/src/app/views/admin/admin-municipios-hub/admin-municipios-hub.component.ts';
const htmlPath = '/Users/aleo/AngularProjects/directoriopaisa.com/src/app/views/admin/admin-municipios-hub/admin-municipios-hub.component.html';
const tenantPath = '/Users/aleo/AngularProjects/directoriopaisa.com/src/app/core/services/tenant.service.ts';

// --- Fix TS ---
let tsContent = fs.readFileSync(tsPath, 'utf8');

tsContent = tsContent.replace(/municipio\.dominioPropuesto/g, "municipio.directorios['principal'].dominio");
tsContent = tsContent.replace(/municipio\.estado/g, "municipio.directorios['principal'].activo");
tsContent = tsContent.replace(/municipio\.mapaActivo/g, "municipio.directorios['principal']._mapaActivo");
tsContent = tsContent.replace(/municipio\.areaBusquedaApify/g, "municipio.directorios['principal'].areaBusquedaApify");
tsContent = tsContent.replace(/municipio\.logoUrl/g, "municipio.directorios['principal'].logoUrl");
tsContent = tsContent.replace(
  "municipio.directorios['principal'].activo = 'PROVISIONANDO';",
  "" // Remove this line as it was string before, now it's boolean
);
tsContent = tsContent.replace(
  "municipio.directorios['principal'].activo = 'PENDIENTE';",
  ""
);
tsContent = tsContent.replace(
  "municipio.directorios['principal'].activo = 'ACTIVO';",
  "municipio.directorios['principal'].activo = true;"
);
// Fix any remaining incorrect assignments
tsContent = tsContent.replace(/municipio\.directorios\['principal'\]\.activo = '.*?';/g, "");

fs.writeFileSync(tsPath, tsContent);

// --- Fix HTML ---
let htmlContent = fs.readFileSync(htmlPath, 'utf8');
htmlContent = htmlContent.replace(/municipio\.dominioPropuesto/g, "municipio.directorios['principal'].dominio");
htmlContent = htmlContent.replace(/municipio\.estado === 'ACTIVO'/g, "municipio.directorios['principal'].activo");
htmlContent = htmlContent.replace(/municipio\.estado !== 'ACTIVO'/g, "!municipio.directorios['principal'].activo");
htmlContent = htmlContent.replace(/municipio\.estado === 'PENDIENTE'/g, "!municipio.directorios['principal'].activo");
htmlContent = htmlContent.replace(/municipio\.estado/g, "(municipio.directorios['principal'].activo ? 'ACTIVO' : 'PENDIENTE')");
htmlContent = htmlContent.replace(/municipio\.mapaActivo/g, "municipio.directorios['principal']._mapaActivo");
htmlContent = htmlContent.replace(/municipio\.areaBusquedaApify/g, "municipio.directorios['principal'].areaBusquedaApify");
htmlContent = htmlContent.replace(/municipio\.logoUrl/g, "municipio.directorios['principal'].logoUrl");
htmlContent = htmlContent.replace(/municipio\.descripcion/g, "municipio.directorios['principal'].descripcion");

fs.writeFileSync(htmlPath, htmlContent);

// --- Fix Tenant Service ---
let tenantContent = fs.readFileSync(tenantPath, 'utf8');

tenantContent = tenantContent.replace(
  "import { DIRECTORIOS_CONFIG } from '../../data/directorios.const';",
  "import { ANTIOQUIA_HUB } from '../../data/antioquia-hub.const';"
);

tenantContent = tenantContent.replace(
  /readonly tenantConfig = computed.*?\n.*?\n.*?\n.*?\n  \}\);/m,
`  readonly tenantConfig = computed<DirectorioInterface | null>(() => {
    // Aplanar todos los directorios (principales y sectores) de todos los municipios
    const allDirectorios = Object.values(ANTIOQUIA_HUB).flatMap(m => Object.values(m.directorios));
    return allDirectorios.find(d => d.id === this.currentTenant()) || null;
  });`
);

tenantContent = tenantContent.replace(
  /private detectarTenant\(\): void \{[\s\S]*?\}/m,
`  private detectarTenant(): void {
    const hostname = this.document.location.hostname;
    
    // Aplanar el árbol para buscar qué directorio responde a este dominio
    const allDirectorios = Object.values(ANTIOQUIA_HUB).flatMap(m => Object.values(m.directorios));
    const tenantEncontrado = allDirectorios.find(d => hostname.includes(d.dominio) && d.activo);
    
    if (tenantEncontrado) {
      this.currentTenant.set(tenantEncontrado.id);
    }
  }`
);

fs.writeFileSync(tenantPath, tenantContent);
console.log("Fix aplicado correctamente");
