import fs from "fs";

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

function processBackup() {
  try {
    const rawData = fs.readFileSync("./src/app/data/negocios_backup.json", "utf-8");
    const negocios = JSON.parse(rawData);

    const negociosSeed = negocios.map(negocio => {
      // Crear ID propio: nombre-del-negocio-copacabana
      const nombreSlug = generateSlug(negocio.nombre || "sin-nombre");
      const idPropio = `${nombreSlug}-copacabana`;

      return {
        id: idPropio,
        nombre: negocio.nombre,
        categoria: negocio.categoria,
        seccion: negocio.seccion,
        ubicacion: {
          direccion: negocio.ubicacion?.direccion || "",
          barrio: negocio.ubicacion?.barrio || "Copacabana",
          ciudad: "Copacabana",
          latitud: negocio.ubicacion?.latitud || 0,
          longitud: negocio.ubicacion?.longitud || 0
        },
        contacto: {
          telefono: negocio.contacto?.telefono || "",
          whatsapp: negocio.contacto?.whatsapp || ""
        },
        // Marcarlo como pendiente de revisión manual
        revisionManual: "Pendiente"
      };
    });

    // Eliminar duplicados en caso de que varios negocios generen el mismo slug
    const unicos = [];
    const map = new Map();
    for (const item of negociosSeed) {
        if(!map.has(item.id)){
            map.set(item.id, true);
            unicos.push(item);
        }
    }

    fs.writeFileSync("negocios_manual_seed.json", JSON.stringify(unicos, null, 2));
    console.log(`Se generó 'negocios_manual_seed.json' con ${unicos.length} negocios listos para revisión manual.`);
  } catch (error) {
    console.error("Error procesando el backup:", error);
  }
}

processBackup();
