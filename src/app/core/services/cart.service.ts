import { Injectable, signal } from '@angular/core';
import { CUPONES } from '../data/seed-data';
import { AppliedCoupon, CartItem } from '../models/product.model';
import { ProductService } from './product.service';

const DB_KEY = 'ecommerce_carritos_db';
const NUMERO_WHATSAPP_TIENDA = '573233426228';

@Injectable({ providedIn: 'root' })
export class CartService {
  /** Cantidad total de items en el carrito del usuario/invitado actual, para el badge del header. */
  readonly totalItems = signal<number>(0);

  constructor(private productService: ProductService) {}

  private leerDB(): Record<string, CartItem[]> {
    return JSON.parse(localStorage.getItem(DB_KEY) || '{}');
  }

  private guardarDB(db: Record<string, CartItem[]>): void {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  }

  private clave(idUsuario: string | null): string {
    return idUsuario || 'invitado';
  }

  obtener(idUsuario: string | null): CartItem[] {
    const db = this.leerDB();
    return db[this.clave(idUsuario)] || [];
  }

  refrescarContador(idUsuario: string | null): void {
    const items = this.obtener(idUsuario);
    this.totalItems.set(items.reduce((a, it) => a + it.cantidad, 0));
  }

  agregar(idUsuario: string | null, item: { idProducto: string; talla: string | null; cantidad: number }): CartItem[] {
    const db = this.leerDB();
    const clave = this.clave(idUsuario);
    if (!db[clave]) db[clave] = [];
    const existente = db[clave].find((it) => it.idProducto === item.idProducto && it.talla === item.talla);
    if (existente) {
      existente.cantidad += item.cantidad;
    } else {
      db[clave].push({ idProducto: item.idProducto, talla: item.talla || null, cantidad: item.cantidad });
    }
    this.guardarDB(db);
    this.refrescarContador(idUsuario);
    return db[clave];
  }

  actualizarCantidad(idUsuario: string | null, idProducto: string, talla: string | null, cantidad: number): CartItem[] {
    const db = this.leerDB();
    const clave = this.clave(idUsuario);
    const item = (db[clave] || []).find((it) => it.idProducto === idProducto && it.talla === talla);
    if (item) item.cantidad = Math.max(1, cantidad);
    this.guardarDB(db);
    this.refrescarContador(idUsuario);
    return db[clave];
  }

  eliminar(idUsuario: string | null, idProducto: string, talla: string | null): CartItem[] {
    const db = this.leerDB();
    const clave = this.clave(idUsuario);
    db[clave] = (db[clave] || []).filter((it) => !(it.idProducto === idProducto && it.talla === talla));
    this.guardarDB(db);
    this.refrescarContador(idUsuario);
    return db[clave];
  }

  vaciar(idUsuario: string | null): void {
    const db = this.leerDB();
    db[this.clave(idUsuario)] = [];
    this.guardarDB(db);
    this.refrescarContador(idUsuario);
  }

  calcularSubtotal(idUsuario: string | null): number {
    const items = this.obtener(idUsuario);
    return items.reduce((acc, it) => {
      const producto = this.productService.obtenerProducto(it.idProducto);
      return producto ? acc + producto.precio * it.cantidad : acc;
    }, 0);
  }

  validarCupon(codigo: string): AppliedCoupon | null {
    const cupon = CUPONES[(codigo || '').toUpperCase()];
    if (!cupon) return null;
    return { codigo: codigo.toUpperCase(), ...cupon };
  }

  aplicarDescuento(subtotal: number, cupon: AppliedCoupon | null): number {
    if (!cupon) return 0;
    if (cupon.tipo === 'porcentaje') return Math.round(subtotal * (cupon.valor / 100));
    return 0;
  }

  enlaceCompartir(idUsuario: string | null): string | null {
    const items = this.obtener(idUsuario);
    if (items.length === 0) return null;
    const lineas = items.map((it) => {
      const p = this.productService.obtenerProducto(it.idProducto);
      const talla = it.talla ? ` (talla ${it.talla})` : '';
      return `• ${p?.nombre}${talla} x${it.cantidad}`;
    });
    const texto = `Mira lo que tengo en mi carrito de E-commerce:\n${lineas.join('\n')}\n\n${window.location.origin}/`;
    return 'https://wa.me/' + NUMERO_WHATSAPP_TIENDA + '?text=' + encodeURIComponent(texto);
  }
}
