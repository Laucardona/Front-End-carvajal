import { Injectable } from '@angular/core';
import { AppNotification } from '../models/product.model';

const DB_KEY = 'ecommerce_notificaciones_db';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private leerDB(): Record<string, AppNotification[]> {
    return JSON.parse(localStorage.getItem(DB_KEY) || '{}');
  }

  private guardarDB(db: Record<string, AppNotification[]>): void {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  }

  enviar(idUsuario: string, datos: { titulo: string; mensaje: string; tipo: AppNotification['tipo'] }): void {
    const db = this.leerDB();
    if (!db[idUsuario]) db[idUsuario] = [];
    db[idUsuario].unshift({
      id: 'n' + Date.now() + Math.floor(Math.random() * 1000),
      titulo: datos.titulo,
      mensaje: datos.mensaje,
      tipo: datos.tipo || 'general',
      fecha: new Date().toISOString(),
      leida: false,
    });
    this.guardarDB(db);
  }

  listar(idUsuario: string): AppNotification[] {
    return this.leerDB()[idUsuario] || [];
  }

  marcarLeida(idUsuario: string, idNotificacion: string): void {
    const db = this.leerDB();
    const n = (db[idUsuario] || []).find((x) => x.id === idNotificacion);
    if (n) n.leida = true;
    this.guardarDB(db);
  }

  marcarTodasLeidas(idUsuario: string): void {
    const db = this.leerDB();
    (db[idUsuario] || []).forEach((n) => (n.leida = true));
    this.guardarDB(db);
  }

  contarNoLeidas(idUsuario: string): number {
    return this.listar(idUsuario).filter((n) => !n.leida).length;
  }
}
