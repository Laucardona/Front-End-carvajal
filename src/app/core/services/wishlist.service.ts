import { Injectable } from '@angular/core';

const DESEOS_KEY = 'ecommerce_lista_deseos';
const HISTORIAL_KEY = 'ecommerce_historial_navegacion';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private leer(key: string): Record<string, string[]> {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }

  private guardar(key: string, db: Record<string, string[]>): void {
    localStorage.setItem(key, JSON.stringify(db));
  }

  alternar(idUsuario: string, idProducto: string): boolean {
    const db = this.leer(DESEOS_KEY);
    if (!db[idUsuario]) db[idUsuario] = [];
    const idx = db[idUsuario].indexOf(idProducto);
    let agregado: boolean;
    if (idx === -1) {
      db[idUsuario].push(idProducto);
      agregado = true;
    } else {
      db[idUsuario].splice(idx, 1);
      agregado = false;
    }
    this.guardar(DESEOS_KEY, db);
    return agregado;
  }

  estaEnLista(idUsuario: string, idProducto: string): boolean {
    const db = this.leer(DESEOS_KEY);
    return (db[idUsuario] || []).includes(idProducto);
  }

  listar(idUsuario: string): string[] {
    const db = this.leer(DESEOS_KEY);
    return db[idUsuario] || [];
  }

  registrarVisita(idUsuario: string | null, idProducto: string): void {
    if (!idUsuario) return;
    const db = this.leer(HISTORIAL_KEY);
    if (!db[idUsuario]) db[idUsuario] = [];
    db[idUsuario] = db[idUsuario].filter((id) => id !== idProducto);
    db[idUsuario].unshift(idProducto);
    db[idUsuario] = db[idUsuario].slice(0, 20);
    this.guardar(HISTORIAL_KEY, db);
  }

  historial(idUsuario: string): string[] {
    const db = this.leer(HISTORIAL_KEY);
    return db[idUsuario] || [];
  }
}
