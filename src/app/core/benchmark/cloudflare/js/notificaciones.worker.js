export default {
    async fetch(request, env) {
      const urlProyectoFCM      = "https://fcm.googleapis.com/v1/projects/TU-PROYECTO-ID/messages:send"; // Aqui debes reemplazar TU-PROYECTO-ID con el ID de tu proyecto de Firebase
      const tokenAutorizacion   = env.FCM_SERVER_KEY;
      
      try {
        const datosEntrada      = await request.json();
        
        const tituloNotificacion = datosEntrada.titulo;
        const cuerpoNotificacion = datosEntrada.cuerpo;
        const listaTokens        = datosEntrada.tokens;
  
        const resultadosEnvio    = [];
  
        for (const tokenIndividual of listaTokens) {
          const tokenDestino    = tokenIndividual;
  
          const estructuraMensaje = {
            message: {
              token: tokenDestino,
              notification: {
                title: tituloNotificacion,
                body : cuerpoNotificacion
              }
            }
          };
  
          const respuestaFCM    = await fetch(urlProyectoFCM, {
            method  : 'POST',
            headers : {
              'Authorization' : `Bearer ${tokenAutorizacion}`,
              'Content-Type'  : 'application/json'
            },
            body    : JSON.stringify(estructuraMensaje)
          });
  
          const statusEnvio     = respuestaFCM.status;
          resultadosEnvio.push({ token: tokenDestino, status: statusEnvio });
        }
  
        const respuestaFinal    = {
          procesados : resultadosEnvio.length,
          detalles   : resultadosEnvio
        };
  
        return new Response(JSON.stringify(respuestaFinal), { 
          status: 200, 
          headers: { 'Content-Type': 'application/json' } 
        });
  
      } catch (error) {
        const errorMensaje      = "Error crítico en el motor de envío masivo del Worker";
        console.error(errorMensaje, error);
        
        return new Response(errorMensaje, { status: 500 });
      }
    }
  };
  
  
  
  
  
  // Fin del componente o servicio