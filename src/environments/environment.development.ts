export const environment = {
    production: false,
    
    // Objeto de configuración principal para conectar tu Frontend de Angular con el Backend de Firebase.
    // - apiKey: Identificador público de la base de datos y servicios (Tiene bloqueos de seguridad por dominio HTTP).
    // - authDomain: Dominio utilizado por Firebase Auth para manejar redirecciones de inicio de sesión.
    // - projectId: El ID único de tu proyecto dentro del ecosistema de Google Cloud.
    // - storageBucket: Ruta base donde se almacenan los archivos multimedia (imágenes, logos).
    // - messagingSenderId: ID numérico usado internamente por Firebase para enviar notificaciones Push (FCM).
    // - appId: ID único que Firebase asigna a tu aplicación web.
    // - measurementId: Llave de Google Analytics (GA4) vinculada a este proyecto.
    firebaseConfig : {
        apiKey: "AIzaSyDWfuWkDTun9xzbasmW7Y-ctevQm1i-o2k",
        authDomain: "copaguia-53f7f.firebaseapp.com",
        projectId: "copaguia-53f7f",
        storageBucket: "copaguia-53f7f.appspot.com",
        messagingSenderId: "719139766457",
        appId: "1:719139766457:web:1f75352dca7771537e1b68",
        measurementId: "G-DDJYYD9THN"
      },
     
      // Recuerda que se debe instalar Java
      // Reconstruir Nix agregando el paquete  de Java
      // Configurar correctamente firebase.json

      // Llave pública de Google Maps para cargar los scripts de mapas en la interfaz (Restringida por dominio HTTP).
      googleMapsApiKey: 'AIzaSyBtix74P-qV8WDEf57HG8nkuKdvnZCcG10',
};
