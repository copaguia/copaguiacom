

addEventListener('message', ({ data }) => {
    const { lista, termino, categoria } = data;
    
    const resultados = lista.filter((negocio: any) => {
      const coincideNombre    = negocio.nombre.toLowerCase().includes(termino.toLowerCase());
      const coincideBarrio    = negocio.ubicacion.barrio.toLowerCase().includes(termino.toLowerCase());
      const coincideCategoria = categoria ? negocio.categoria === categoria : true;
      
      return (coincideNombre || coincideBarrio) && coincideCategoria;
    });
  
    postMessage(resultados);
  });