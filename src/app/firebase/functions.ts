// src/app/firebase/functions.ts
import { getFunctions, httpsCallable, connectFunctionsEmulator, HttpsCallableResult } from 'firebase/functions';
import { app } from './firebase-config';

// Inicializar Functions
console.log('Initializing functions with app:', app);
export const functions = getFunctions(app);


// Definición de tipos para las funciones disponibles
export type CloudFunctionName = 
  | 'procesarPago'
  | 'generarReporte'
  | 'enviarNotificacion'
  | 'procesarPedido'
  | 'generarFactura';

// Interfaces para parámetros y respuestas de funciones específicas
export interface ProcesarPagoParams {
  idPedido: string;
  monto: number;
  metodoPago: string;
  datosCliente: {
    nombre: string;
    email: string;
    telefono?: string;
  };
}

export interface ProcesarPagoResponse {
  idTransaccion: string;
  estado: 'completado' | 'fallido' | 'pendiente';
  mensaje: string;
  timestamp: number;
}

export interface EnviarNotificacionParams {
  destinatario: string;
  titulo: string;
  mensaje: string;
  datos?: Record<string, string>;
  prioridad?: 'alta' | 'normal' | 'baja';
}

export interface EnviarNotificacionResponse {
  enviado: boolean;
  mensaje: string;
  idNotificacion?: string;
}

// Función genérica para llamar a Cloud Functions
export async function callCloudFunction<T = any, R = any>(
  functionName: CloudFunctionName,
  data: T
): Promise<HttpsCallableResult<R>> {
    const functionCall = httpsCallable<T, R>(functions, functionName);
    try {
        const result = await functionCall(data);
        return result;
    } catch (error) {
        console.error('Error calling Cloud Function', functionName, error);
        throw error;
    }

}

// Funciones específicas con tipado fuerte

// Procesar pago
export async function procesarPago(
  params: ProcesarPagoParams
): Promise<ProcesarPagoResponse> {
  const result = await callCloudFunction<ProcesarPagoParams, ProcesarPagoResponse>(
    'procesarPago',
    params
  );
  return result.data;
}

// Enviar notificación
export async function enviarNotificacion(
  params: EnviarNotificacionParams
): Promise<EnviarNotificacionResponse> {
  const result = await callCloudFunction<EnviarNotificacionParams, EnviarNotificacionResponse>(
    'enviarNotificacion',
    params
  );
  return result.data;
}

// Generar reporte
export async function generarReporte(
  tipoReporte: string,
  fechaInicio: string,
  fechaFin: string,
  filtros?: Record<string, any>
): Promise<{ url: string; nombreArchivo: string }> {
  const result = await callCloudFunction(
    'generarReporte',
    {
      tipoReporte,
      fechaInicio,
      fechaFin,
      filtros
    }
  );
  return result.data;
}

// Función para procesar un pedido
export async function procesarPedido(
  idPedido: string,
  estado: 'preparando' | 'enviando' | 'entregado' | 'cancelado',
  notasAdicionales?: string
): Promise<{ actualizado: boolean; mensaje: string }> {
  const result = await callCloudFunction(
    'procesarPedido',
    {
      idPedido,
      estado,
      notasAdicionales,
      timestamp: new Date().toISOString()
    }
  );
  return result.data;
}

// Función para generar una factura
export async function generarFactura(
  idPedido: string,
  incluirImpuestos: boolean = true
): Promise<{ urlFactura: string; idFactura: string }> {
  const result = await callCloudFunction(
    'generarFactura',
    {
      idPedido,
      incluirImpuestos,
      fechaGeneracion: new Date().toISOString()
    }
  );
  return result.data;
}
