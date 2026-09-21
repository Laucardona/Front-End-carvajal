import { Injectable } from '@angular/core';
import { Transaction } from '../models/product.model';

const DB_KEY = 'ecommerce_pagos_db';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private leerDB(): Transaction[] {
    return JSON.parse(localStorage.getItem(DB_KEY) || '[]');
  }

  private guardarDB(pagos: Transaction[]): void {
    localStorage.setItem(DB_KEY, JSON.stringify(pagos));
  }

  validarTarjeta(numero: string, vencimiento: string, cvv: string): string | null {
    const numeroLimpio = (numero || '').replace(/\s/g, '');
    if (!/^\d{16}$/.test(numeroLimpio)) return 'El número de tarjeta debe tener 16 dígitos.';
    if (!/^\d{2}\/\d{2}$/.test(vencimiento || '')) return 'La fecha de vencimiento debe ser MM/AA.';
    if (!/^\d{3,4}$/.test(cvv || '')) return 'El CVV debe tener 3 o 4 dígitos.';
    return null;
  }

  procesar(datos: { idUsuario: string; metodo: string; monto: number; referencia: string }): Promise<{ ok: boolean; transaccion: Transaction }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const transaccion: Transaction = {
          id: 'txn' + Date.now(),
          idUsuario: datos.idUsuario,
          metodo: datos.metodo,
          monto: datos.monto,
          referencia: datos.referencia,
          estado: 'aprobada',
          fecha: new Date().toISOString(),
        };
        const pagos = this.leerDB();
        pagos.unshift(transaccion);
        this.guardarDB(pagos);
        resolve({ ok: true, transaccion });
      }, 1200); // simula latencia real de una pasarela de pago
    });
  }
}
