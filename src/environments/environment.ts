export const environment = {
    production: true,
    
    // Objeto de configuración principal para conectar tu Frontend de Angular con el Backend de Firebase.
    // - apiKey: Identificador público de la base de datos y servicios (Tiene bloqueos de seguridad por dominio HTTP).
    // - authDomain: Dominio utilizado por Firebase Auth para manejar redirecciones de inicio de sesión.
    // - projectId: El ID único de tu proyecto dentro del ecosistema de Google Cloud.
    // - storageBucket: Ruta base donde se almacenan los archivos multimedia (imágenes, logos).
    // - messagingSenderId: ID numérico usado internamente por Firebase para enviar notificaciones Push (FCM).
    // - appId: ID único que Firebase asigna a tu aplicación web.
    // - measurementId: Llave de Google Analytics (GA4) vinculada a este proyecto.
    firebaseConfig : {
        apiKey: "AIzaSyAzP5_cqEl40eldTiiR6FPPO2tBVpxrBk0",
        authDomain: "directoriopaisa.com",
        projectId: "directorio-paisa",
        storageBucket: "directorio-paisa.firebasestorage.app",
        messagingSenderId: "743750203663",
        appId: "1:743750203663:web:ef0cefedb499330699e67a",
        measurementId: "G-S50VSB4YS0"
      },
      
    // Llave pública (VAPID) para encriptar y autorizar Notificaciones Push web nativas a través del navegador.
    vapidKey: 'BK6DsRiQcfyyVucN5tFxlfUBU09LrEiVC4v5WAJVxa6b2cyhTJJZ_B4qunaS60hjGCtCBAcSTZBMiADCkTMGSm0',
    
    // Llave pública de Google Maps para cargar los scripts de mapas en la interfaz (Restringida por dominio HTTP).
    googleMapsApiKey: 'AIzaSyBtix74P-qV8WDEf57HG8nkuKdvnZCcG10',
};
