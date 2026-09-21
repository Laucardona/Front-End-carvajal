import { Injectable } from '@angular/core';
import { Order, OrderItem } from '../models/product.model';
import { formatCOP } from './utils';
import { NotificationService } from './notification.service';
import { ProductService } from './product.service';

const DB_KEY = 'ecommerce_pedidos_db';

export interface CrearPedidoDatos {
  idUsuario: string;
  items: OrderItem[];
  ciudad: string;
  costoEnvio: number;
  cupon: string | null;
  subtotal: number;
  total: number;
  idTransaccion: string;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(
    private notificationService: NotificationService,
    private productService: ProductService
  ) {}

  private leerDB(): Order[] {
    return JSON.parse(localStorage.getItem(DB_KEY) || '[]');
  }

  private guardarDB(pedidos: Order[]): void {
    localStorage.setItem(DB_KEY, JSON.stringify(pedidos));
  }

  crear(datos: CrearPedidoDatos): Order {
    const pedidos = this.leerDB();
    const pedido: Order = {
      id: 'EC-' + Date.now().toString().slice(-8),
      idUsuario: datos.idUsuario,
      items: datos.items,
      ciudad: datos.ciudad,
      costoEnvio: datos.costoEnvio,
      cupon: datos.cupon || null,
      subtotal: datos.subtotal,
      total: datos.total,
      idTransaccion: datos.idTransaccion,
      estado: 'confirmado',
      fecha: new Date().toISOString(),
      devolucion: null,
    };
    pedidos.unshift(pedido);
    this.guardarDB(pedidos);

    // descuenta existencias por cada item comprado
    datos.items.forEach((it) => this.productService.descontarStock(it.idProducto, it.talla, it.cantidad));

    this.notificationService.enviar(datos.idUsuario, {
      titulo: 'Pedido confirmado',
      mensaje: `Tu pedido ${pedido.id} fue confirmado por ${formatCOP(datos.total)}. Te avisaremos cuando salga hacia ${datos.ciudad}.`,
      tipo: 'pedido',
    });

    // simula el avance automatico de estados para que el rastreo se vea vivo
    this.simularAvance(pedido.id, datos.idUsuario);

    return pedido;
  }

  private simularAvance(idPedido: string, idUsuario: string): void {
    const pasos: { estado: Order['estado']; ms: number; texto: string }[] = [
      { estado: 'preparando', ms: 15000, texto: 'Tu pedido está siendo preparado en la bodega de Armenia.' },
      { estado: 'en_camino', ms: 35000, texto: 'Tu pedido salió hacia tu ciudad de destino.' },
    ];
    pasos.forEach((paso) => {
      setTimeout(() => {
        const pedidos = this.leerDB();
        const p = pedidos.find((x) => x.id === idPedido);
        if (!p || p.estado === 'entregado' || p.devolucion) return;
        p.estado = paso.estado;
        this.guardarDB(pedidos);
        this.notificationService.enviar(idUsuario, {
          titulo: 'Actualización de pedido ' + idPedido,
          mensaje: paso.texto,
          tipo: 'rastreo',
        });
      }, paso.ms);
    });
  }

  listarPorUsuario(idUsuario: string): Order[] {
    return this.leerDB().filter((p) => p.idUsuario === idUsuario);
  }

  obtener(idPedido: string): Order | null {
    return this.leerDB().find((p) => p.id === idPedido) || null;
  }

  solicitarDevolucion(idPedido: string, motivo: string): { ok: boolean; error?: string; pedido?: Order } {
    const pedidos = this.leerDB();
    const p = pedidos.find((x) => x.id === idPedido);
    if (!p) return { ok: false, error: 'Pedido no encontrado.' };
    p.devolucion = { motivo, estado: 'en_revision', fecha: new Date().toISOString() };
    this.guardarDB(pedidos);
    this.notificationService.enviar(p.idUsuario, {
      titulo: 'Devolución solicitada',
      mensaje: `Recibimos tu solicitud de devolución para el pedido ${idPedido}. La revisaremos en 1-2 días hábiles.`,
      tipo: 'devolucion',
    });
    return { ok: true, pedido: p };
  }
}
