import { Injectable } from '@angular/core';
import { CIUDADES_ENVIO } from '../data/seed-data';
import { City } from '../models/product.model';

export interface CalculoEnvio {
  ciudad: string;
  distanciaKm: number;
  costo: number;
  diasEstimados: string;
}

export interface EtapaRastreo {
  etapa: string;
  etiqueta: string;
  completado: boolean;
}

const ETAPAS = ['confirmado', 'preparando', 'en_camino', 'entregado'];
const ETIQUETAS: Record<string, string> = {
  confirmado: 'Pedido confirmado',
  preparando: 'Preparando en bodega',
  en_camino: 'En camino',
  entregado: 'Entregado',
};

@Injectable({ providedIn: 'root' })
export class ShippingService {
  readonly ETAPAS = ETAPAS;

  listarCiudades(): City[] {
    return CIUDADES_ENVIO;
  }

  calcular(ciudad: string, envioGratis = false): CalculoEnvio {
    const info = CIUDADES_ENVIO.find((c) => c.ciudad === ciudad) || CIUDADES_ENVIO[0];
    return {
      ciudad: info.ciudad,
      distanciaKm: info.distanciaKm,
      costo: envioGratis ? 0 : info.costo,
      diasEstimados: info.dias,
    };
  }

  lineaDeTiempo(estadoActual: string): EtapaRastreo[] {
    const idxActual = ETAPAS.indexOf(estadoActual);
    return ETAPAS.map((etapa, idx) => ({
      etapa,
      etiqueta: ETIQUETAS[etapa],
      completado: idx <= idxActual,
    }));
  }
}
