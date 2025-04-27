// src/app/firebase/analytics.ts
import { getAnalytics, logEvent, setUserId, setUserProperties } from 'firebase/analytics';
import { app } from './firebase-config';

// Inicialización de Analytics
export const analytics = getAnalytics(app);

// Definición de tipos para eventos personalizados
export type EventName = string;

export type CustomEventName = 
  | 'view_product'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'begin_checkout'
  | 'purchase'
  | 'view_category'
  | 'create_account'
  | 'login'
  | 'share'
  | 'app_error';

// Tipos de parámetros para eventos
export interface EventParams {
  [key: string]: any;
}

// Función base para registrar cualquier evento
function trackEventBase(
  eventName: EventName, 
  eventParams?: EventParams
): void {
  try {
    logEvent(analytics, eventName, eventParams);
  } catch (error) {
    console.error(`Error al registrar evento ${eventName}:`, error);
  }
}

// Función pública para registrar eventos estándar
export function trackEvent(
  eventName: EventName, 
  eventParams?: EventParams
): void {
  trackEventBase(eventName, eventParams);
}

// Función para registrar eventos personalizados
export function trackCustomEvent(
  eventName: CustomEventName, 
  eventParams?: EventParams
): void {
  trackEventBase(eventName as EventName, eventParams);
}

// Función para registrar evento de visualización de página
export function trackPageView(
  pageName: string, 
  pageParams?: EventParams
): void {
  trackEventBase('page_view', {
    page_title: pageName,   
    page_location: window.location.href,
    ...pageParams
  });
}

// Función para registrar evento de visualización de producto
export function trackProductView(
  productId: string, 
  productName: string, 
  price: number = 0, 
  category?: string
): void {
  trackEventBase('view_item', {
    items: [{
      item_id: productId,
      item_name: productName,
      price,
      item_category: category
    }]
  });
}

// Función para registrar evento de agregar al carrito
export function trackAddToCart(
  productId: string, 
  productName: string, 
  price: number, 
  quantity: number, 
  category?: string
): void {
  trackEventBase('add_to_cart', {
    currency: 'USD',
    value: price * quantity,
    items: [{
      item_id: productId,
      item_name: productName,
      price,
      quantity,
      item_category: category
    }]
  });
}

// Función para registrar evento de compra
export function trackPurchase(
  transactionId: string, 
  value: number, 
  tax?: number, 
  shipping?: number, 
  currency: string = 'USD',
  items?: Array<{
    item_id: string,
    item_name: string,
    price: number,
    quantity: number,
    item_category?: string
  }>
): void {
  trackEventBase('purchase', {
    transaction_id: transactionId,
    value,
    tax,
    shipping,
    currency,
    items
  });
}

// Función para registrar inicio de sesión
export function trackLogin(method: string): void {
  trackEventBase('login', { method });
}

// Función para registrar registro de usuario
export function trackSignUp(method: string): void {
  trackEventBase('sign_up', { method });
}

// Función para registrar error de la aplicación
export function trackError(
  errorCode: string, 
  errorMessage: string, 
  fatal: boolean = false
): void {
  trackEventBase('app_error', {
    error_code: errorCode,
    error_message: errorMessage,
    fatal
  });
}

// Función para establecer ID de usuario
export function setAnalyticsUserId(userId: string | null): void {
  try {
    setUserId(analytics, userId);
  } catch (error) {
    console.error('Error al establecer ID de usuario:', error);
  }
}

// Función para establecer propiedades del usuario
export function setAnalyticsUserProperties(properties: Record<string, any>): void {
  try {
    setUserProperties(analytics, properties);
  } catch (error) {
    console.error('Error al establecer propiedades de usuario:', error);
  }
}