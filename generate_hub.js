const fs = require('fs');

const oldMunContent = fs.readFileSync('/Users/aleo/AngularProjects/directoriopaisa.com/src/app/data/municipios-antioquia.ts', 'utf8');

const arrayMatch = oldMunContent.match(/export const MUNICIPIOS_ANTIOQUIA: MunicipioAntioquia\[\] = (\[[\s\S]*?\]);/);
if (!arrayMatch) {
   console.error("Could not find array");
   process.exit(1);
}
const arrayCode = arrayMatch[1];
const munList = eval('(' + arrayCode + ')');

const hub = {};
munList.forEach(m => {
  const dirPrincipal = {
     id: m.id + '_principal',
     dominio: m.dominioPropuesto || '',
     nombre: m.nombre,
     descripcion: m.descripcion || `Directorio comercial de ${m.nombre}`,
     logoUrl: '/assets/logos/default.png',
     fondoUrl: m.fondoUrl || '',
     seoConfig: {
        titleTemplate: `${m.nombre} | %s`,
        metaDescription: m.descripcion || `Directorio oficial de ${m.nombre}`,
        keywords: [m.nombre, 'directorio', 'antioquia'],
        ogImage: m.fondoUrl || '',
        schemaType: 'WebSite'
     },
     municipio: m.nombre,
     sector: 'Principal',
     activo: m.estado === 'ACTIVO',
  };
  
  hub[m.id] = {
     id: m.id,
     nombre: m.nombre,
     subregion: m.subregion,
     directorios: {
        'principal': dirPrincipal
     }
  };
});

// Niquia
hub['bello'].directorios['niquia'] = {
    id: 'niquia',
    nombre: 'Niquía',
    dominio: 'niquia.com',
    descripcion: 'Directorio de Niquía',
    logoUrl: '/assets/logos/niquia.png',
    fondoUrl: hub['bello'].directorios['principal'].fondoUrl,
    seoConfig: {
      titleTemplate: 'Niquía | %s',
      metaDescription: 'El mejor directorio de Niquía',
      keywords: ['niquia', 'bello', 'directorio'],
      ogImage: '/assets/seo/niquia.png',
      schemaType: 'WebSite'
    },
    municipio: 'Bello',
    sector: 'Niquía',
    activo: true,
    areaBusquedaApify: { lat: 6.3378, lng: -75.5450, radioKm: 2 }
};

// El Hueco
hub['medellin'].directorios['elhueco'] = {
    id: 'elhueco',
    nombre: 'El Hueco',
    dominio: 'elhueco.online',
    descripcion: 'Directorio de El Hueco de Medellín',
    logoUrl: '/assets/logos/elhueco.png',
    fondoUrl: hub['medellin'].directorios['principal'].fondoUrl,
    seoConfig: {
      titleTemplate: 'El Hueco | %s',
      metaDescription: 'Directorio oficial de El Hueco en Medellín',
      keywords: ['el hueco', 'medellin', 'compras', 'centro'],
      ogImage: '/assets/seo/elhueco.png',
      schemaType: 'WebSite'
    },
    municipio: 'Medellín',
    sector: 'El Hueco',
    activo: true,
    areaBusquedaApify: { lat: 6.2486, lng: -75.5702, radioKm: 1.5 }
};

// Copaguia overrides the principal
hub['copacabana'].directorios['principal'] = {
    id: 'copaguia',
    nombre: 'Copaguía',
    dominio: 'copaguia.com',
    descripcion: 'Directorio de Copacabana',
    logoUrl: '/assets/logos/copaguia.png',
    fondoUrl: hub['copacabana'].directorios['principal'].fondoUrl,
    seoConfig: {
      titleTemplate: 'Copaguía | %s',
      metaDescription: 'El mejor directorio de Copacabana',
      keywords: ['copacabana', 'directorio', 'negocios'],
      ogImage: '/assets/seo/copaguia.png',
      schemaType: 'WebSite'
    },
    municipio: 'Copacabana',
    sector: 'Principal',
    activo: true,
    areaBusquedaApify: { lat: 6.3467, lng: -75.5089, radioKm: 3 }
};

const newFileContent = `import { MunicipioGlobal } from '../interfaces/directorio-interface';

export const ANTIOQUIA_HUB: Record<string, MunicipioGlobal> = ${JSON.stringify(hub, null, 2)};
`;

fs.writeFileSync('/Users/aleo/AngularProjects/directoriopaisa.com/src/app/data/antioquia-hub.const.ts', newFileContent);
console.log("Generado antioquia-hub.const.ts exitosamente.");
