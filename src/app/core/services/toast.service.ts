import { Injectable, signal } from '@angular/core';

export type ToastTipo = 'info' | 'exito' | 'advertencia';

export interface Toast {
  id: number;
  mensaje: string;
  tipo: ToastTipo;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private contador = 0;
  readonly toasts = signal<Toast[]>([]);

  mostrar(mensaje: string, tipo: ToastTipo = 'info'): void {
    const id = ++this.contador;
    this.toasts.update((lista) => [...lista, { id, mensaje, tipo }]);
    setTimeout(() => this.cerrar(id), 3200);
  }

  cerrar(id: number): void {
    this.toasts.update((lista) => lista.filter((t) => t.id !== id));
  }
}
