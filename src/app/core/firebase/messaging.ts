import { getMessaging, getToken, onMessage, Messaging, isSupported } from 'firebase/messaging';
import { app } from './firebase-config';
import { environment } from '../../../environments/environment';

// Inicializa el objeto de mensajería
let messaging: Messaging | null = null;

const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  const permission = await Notification.requestPermission();
  return permission;
};

isSupported().then(async (supported) => {
  if (supported) {
    messaging = getMessaging(app);
    if (environment.firebaseConfig) {
      // connectMessagingEmulator(messaging, "localhost", 5000);
      console.log('Firebase Messaging conectado al emulador');
    } else {
      console.log('Firebase Messaging conectado a producción');
    }

    // Solicitar permiso al inicializar (opcional, pero recomendado)
    const permissionResult = await requestNotificationPermission();
    console.log('Permiso de notificación:', permissionResult);
  } else {
    console.log('Firebase Cloud Messaging no es soportado en este navegador');
  }
});

export const getFirebaseToken = async (): Promise<string | null> => {
  if (messaging) {
    try {
      const permission = await requestNotificationPermission();
      if (permission === 'granted') {
        const token = await getToken(messaging, {
          vapidKey: environment.vapidKey
        });
        return token;
      } else if (permission === 'denied') {
        console.warn('Permiso de notificaciones denegado por el usuario.');
        return null;
      } else {
        console.log('Solicitud de permiso de notificaciones descartada.');
        return null;
      }
    } catch (error: any) {
      console.error('Error al obtener el token de Firebase Cloud Messaging:', error);
      // Manejar errores específicos de FCM si es necesario
      if (error?.code === 'messaging/permission-blocked') {
        console.warn('El permiso de notificaciones está bloqueado. Por favor, verifica la configuración del navegador.');
      }
      return null;
    }
  } else {
    console.error('Messaging no está inicializado.');
    return null;
  }
};

// Escuchar mensajes en primer plano
export const onForegroundMessage = (callback: (payload: any) => void) => {
  if (messaging) {
    onMessage(messaging, (payload) => {
      console.log('Mensaje recibido en primer plano:', payload);
      callback(payload);
    });
  } else {
    console.error('Messaging no está inicializado.');
  }
};

// Ejemplo de función para enviar el token al servidor (debes implementarla en tu backend)
export const sendTokenToServer = async (token: string) => {
  try {
    const response = await fetch('/api/save-token', { // Reemplaza '/api/save-token' con tu endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Puedes incluir aquí tu token de autenticación si es necesario
      },
      body: JSON.stringify({ token }),
    });

    if (response.ok) {
      console.log('Token enviado al servidor exitosamente.');
    } else {
      console.error('Error al enviar el token al servidor:', response.statusText);
    }
  } catch (error) {
    console.error('Error de red al enviar el token al servidor:', error);
  }
};

// Ejemplo de cómo podrías obtener y enviar el token
export const setupPushNotifications = async () => {
  if (await isSupported()) {
    const token = await getFirebaseToken();
    if (token) {
      console.log('Token de Firebase:', token);
      // Llama a la función para enviar el token a tu servidor
      sendTokenToServer(token);
    }
  } else {
    console.log('Firebase Cloud Messaging no es soportado en este navegador.');
  }
};