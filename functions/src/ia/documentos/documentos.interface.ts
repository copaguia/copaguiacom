import { Schema } from '@google/genai';

export interface ExtractionStrategy {
  promptOptimizado: string; // [JEO]v2 Robot Protocol
  promptHumano: string;     // Descripcion humana
  schema: Schema;
  modeloDeseado?: string;   // Modelo ideal para esta tarea
}

export interface ExtractionRequest {
  tipo?: string;
  imagenBase64?: string;
  mimeType?: string;
  usarPromptOptimizado?: boolean;
}


