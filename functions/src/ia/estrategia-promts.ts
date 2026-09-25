import { Type } from '@google/genai';
import { ExtractionStrategy } from './documentos/documentos.interface';

export const EXTRACTION_STRATEGIES: Record<string, ExtractionStrategy> = {
  proveedor: {
    modeloDeseado: "gemini-2.5-flash",
    promptOptimizado: `[JEO]v2
Out={esProveedorFormal:boolean,proveedor:{nombre,nit,telefono,direccion,email,requiere_revision:boolean,motivo_revision:string}}
[LOGIC]
IF(is_tirilla OR is_recibo_menor OR no_nit_identificable) { esProveedorFormal=false; proveedor=null }
IF(nit_borroso OR datos_dudosos OR <98%_certeza) { requiere_revision=true; motivo_revision="breve razon" } ELSE { requiere_revision=false }
[!]SoloJSON.NoMD.NulosSiVacio`,
    promptHumano: `Eres un contable experto. Tu tarea es extraer la información del proveedor de la imagen. 
REGLA CRÍTICA: Si la imagen corresponde a una tirilla de caja registradora, un recibo menor de tienda, o no se identifica claramente un NIT o RUT formal de una empresa, debes establecer "esProveedorFormal" en false.
REGLA REVISIÓN: Si el NIT está borroso, es ilegible o tienes dudas, establece "requiere_revision" en true y explica brevemente por qué en "motivo_revision".
Extrae: nombre, nit, teléfono, dirección, email, requiere_revision, motivo_revision. Responde estrictamente en JSON.`,
    schema: {
      type: Type.OBJECT,
      properties: {
        esProveedorFormal: { type: Type.BOOLEAN },
        proveedor: {
          type: Type.OBJECT,
          nullable: true,
          properties: {
            nombre: { type: Type.STRING },
            nit: { type: Type.STRING },
            telefono: { type: Type.STRING },
            direccion: { type: Type.STRING },
            email: { type: Type.STRING },
            requiere_revision: { type: Type.BOOLEAN },
            motivo_revision: { type: Type.STRING }
          }
        }
      },
      required: ["esProveedorFormal"]
    }
  },

  factura: {
    modeloDeseado: "gemini-2.5-pro", // Usamos Pro o Flash según requieras más precisión en facturas complejas
    promptOptimizado: `[JEO]v2
Out={tipoFactura:'MERCANCIA'|'SERVICIO',proveedor:{id:NIT_sin_simbolos,nombre,contacto},documentacion:{numeroFactura,ordenCompra,remision,fechaEmision,fechaRecepcion,fotoUrl},productos:[{info:{referencia,nombre,unidadMedida:'GR'|'UND',categoria},trazabilidad:{loteInterno,loteFabricante,vencimiento},fisico:{cantidad,cantidadActual,temperatura:{producto,nevera},empaqueOk,ubicacionId:'ESTANTERIA 1'|'ESTANTERIA 2'|'NEVERA 1'|'NEVERA 2'|'CONGELADOR 1'|'CONGELADOR 3',estadoFisico:'SELLADO_ORIGINAL'|'EMPEZADO'},financiero:{precioUnitario,subtotalLinea,impuestoTipo}}],totales:{cantidadItems,montoSubtotal,montoImpuestos,montoTotal},auditoria:{notas}}
[MATH]
p=productos
p.subtotalLinea=p.precioUnitario*(p.unidadMedida=='GR'?p.cantidad/1000:p.cantidad)
p.impuestoTipo=(IVA==0||Exento)?'EX':'IVA'
T=totales
T.cantidadItems=len(p)
T.montoSubtotal=sum(p.subtotalLinea)
T.montoTotal=T.montoSubtotal+T.montoImpuestos
[OCR_CHECK]
auditoria.notas=eval(F){
  H_ocr: 9=6?, 8=5?, 0=8? => verify (p.subtotalLinea == p.precioUnitario * (p.unidadMedida=='GR'?p.cantidad/1000:p.cantidad))
  H_sum: verify (sum(p.subtotalLinea) == T.montoSubtotal)
  log: step-by-step math corrections
}
[!]SoloJSON.NoMD.NulosSiVacio`,
    promptHumano: `Eres un experto en extracción de datos de facturas colombianas para Megasanduche. 
Tu tarea es analizar la foto de una factura y devolver un objeto JSON que siga estrictamente la interfaz FacturaInterface.

Reglas de extracción:
1. Identifica el proveedor (Nombre, NIT como ID).
2. Extrae el número de factura y fechas (Emisión y Recepción).
3. Lista todos los productos con su nombre, cantidad, precio unitario y subtotal.
4. Si el producto dice "EX" o "Exento", el impuesto es 0 y el tipo es "EX".
5. Devuelve SIEMPRE y ÚNICAMENTE un objeto JSON válido. No incluyas texto explicativo antes o después.`,
    schema: {
      type: Type.OBJECT,
      properties: {
        tipoFactura: { type: Type.STRING },
        proveedor: {
          type: Type.OBJECT,
          properties: { id: { type: Type.STRING }, nombre: { type: Type.STRING }, contacto: { type: Type.STRING } }
        },
        documentacion: {
          type: Type.OBJECT,
          properties: { numeroFactura: { type: Type.STRING }, ordenCompra: { type: Type.STRING }, remision: { type: Type.STRING }, fechaEmision: { type: Type.STRING }, fechaRecepcion: { type: Type.STRING }, fotoUrl: { type: Type.STRING } }
        },
        productos: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              info: { type: Type.OBJECT, properties: { referencia: { type: Type.STRING }, nombre: { type: Type.STRING }, unidadMedida: { type: Type.STRING }, categoria: { type: Type.STRING } } },
              trazabilidad: { type: Type.OBJECT, properties: { loteInterno: { type: Type.STRING }, loteFabricante: { type: Type.STRING }, vencimiento: { type: Type.STRING } } },
              fisico: { type: Type.OBJECT, properties: { cantidad: { type: Type.NUMBER }, cantidadActual: { type: Type.NUMBER }, temperatura: { type: Type.OBJECT, properties: { producto: { type: Type.NUMBER }, nevera: { type: Type.NUMBER } } }, empaqueOk: { type: Type.BOOLEAN }, ubicacionId: { type: Type.STRING }, estadoFisico: { type: Type.STRING } } },
              financiero: { type: Type.OBJECT, properties: { precioUnitario: { type: Type.NUMBER }, subtotalLinea: { type: Type.NUMBER }, impuestoTipo: { type: Type.STRING } } }
            }
          }
        },
        totales: {
          type: Type.OBJECT,
          properties: { cantidadItems: { type: Type.NUMBER }, montoSubtotal: { type: Type.NUMBER }, montoImpuestos: { type: Type.NUMBER }, montoTotal: { type: Type.NUMBER } }
        },
        auditoria: {
          type: Type.OBJECT,
          properties: { notas: { type: Type.STRING } }
        }
      }
    }
  },

  gasto_hormiga: {
    modeloDeseado: "gemini-1.5-flash-8b", // Modelo ultraligero y económico para comprobantes simples
    promptOptimizado: `[JEO]v2
Out={esGastoHormiga:boolean,gasto:{concepto,valorTotal,fecha:'YYYY-MM-DD',observacion}}
[LOGIC]
IF(is_factura_formal_grande_proveedor_mayorista) { esGastoHormiga=false; gasto=null }
[!]SoloJSON.NoMD.NulosSiVacio`,
    promptHumano: `Eres un contable experto en caja menor. Tu tarea es extraer la información de gastos hormiga/caja menor de la imagen. 
REGLA CRÍTICA: Si la imagen corresponde a una factura formal grande con resolución de facturación y NIT detallado de un proveedor mayorista, debes establecer "esGastoHormiga" en false.
Extrae únicamente: concepto principal, valor total, fecha y observación. Responde estrictamente en JSON.`,
    schema: {
      type: Type.OBJECT,
      properties: {
        esGastoHormiga: { type: Type.BOOLEAN },
        gasto: {
          type: Type.OBJECT,
          nullable: true,
          properties: {
            concepto: { type: Type.STRING },
            valorTotal: { type: Type.NUMBER },
            fecha: { type: Type.STRING },
            observacion: { type: Type.STRING }
          }
        }
      },
      required: ["esGastoHormiga"]
    }
  }
};
