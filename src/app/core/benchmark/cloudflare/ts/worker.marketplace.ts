// cooaguia-marketplace-worker/index.ts

// ESTE WORKER SERVIRA PARA AGREGAR PRODUCTOS AL MARKET PLACE SOLO LO PODRAN UNAR USUARIOS DUEÑÑOS DE NEGOCIOS Y SOLO PODRAN PUBLICAR PRODUCTOS EN NOMBRE DE SUS NEGOCIOS.



export default {
    async fetch(request: Request, env: any): Promise<Response> {
      const { searchParams } = new URL(request.url);
      const categoria        = searchParams.get('categoria');
      const busqueda         = searchParams.get('q')?.toLowerCase();
  
      // 1. Llamada a la API de Firestore (vía REST para el Worker)
      // Nota: El Worker es más rápido haciendo fetch directo a la API REST de Firebase
      const urlFirestore = `https://firestore.googleapis.com/v1/projects/${env.PROJECT_ID}/databases/(default)/documents/negocios`;
      
      const respuesta = await fetch(urlFirestore);
      const data: any = await respuesta.json();
  
      // 2. Lógica de "Aplanamiento" (Marketplace Flattening)
      // Transformamos una lista de negocios en una lista plana de productos
      let productosGlobales: any[] = [];
  
      data.documents.forEach((doc: any) => {
        const negocio = doc.fields;
        const catalogo = negocio.catalogo?.arrayValue?.values || [];
        
        const productosDelNegocio = catalogo.map((item: any) => {
          const p = item.mapValue.fields;
          return {
            id:            p.id.stringValue,
            nombre:        p.nombre.stringValue,
            precio:        Number(p.precio.doubleValue || p.precio.integerValue),
            urlImagen:     p.urlImagen?.stringValue,
            categoriaItem: p.categoriaItem?.stringValue,
            // Datos del negocio para el Marketplace
            negocioId:     doc.name.split('/').pop(),
            nombreNegocio: negocio.nombre.stringValue,
            slugNegocio:   negocio.slug.stringValue,
            logoNegocio:   negocio.logo.stringValue,
            barrio:        negocio.ubicacion.mapValue.fields.barrio.stringValue
          };
        });
  
        productosGlobales = [...productosGlobales, ...productosDelNegocio];
      });
  
      // 3. Filtrado en el Edge (Ultra rápido)
      if (busqueda) {
        productosGlobales = productosGlobales.filter(p => 
          p.nombre.toLowerCase().includes(busqueda) || 
          p.categoriaItem.toLowerCase().includes(busqueda)
        );
      }
  
      return new Response(JSON.stringify(productosGlobales), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' // CORS para tu App Angular
        }
      });
    }
  };