import { Injectable } from '@angular/core';
import { CATEGORIAS, PRODUCTOS } from '../data/seed-data';
import { Category, Product, Review } from '../models/product.model';

const DB_KEY = 'ecommerce_productos_db';

export interface FiltroProductos {
  categoria?: string;
  tipo?: string;
  busqueda?: string;
  orden?: 'precio-asc' | 'precio-desc' | 'rating' | '';
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor() {
    this.init();
  }

  private init(): void {
    if (!localStorage.getItem(DB_KEY)) {
      localStorage.setItem(DB_KEY, JSON.stringify(PRODUCTOS));
    }
  }

  private leerDB(): Product[] {
    return JSON.parse(localStorage.getItem(DB_KEY) || '[]');
  }

  private guardarDB(productos: Product[]): void {
    localStorage.setItem(DB_KEY, JSON.stringify(productos));
  }

  listarCategorias(): Category[] {
    return CATEGORIAS;
  }

  /**
   * Mezcla un producto REAL (venido de Productos-M) en el catálogo local:
   * lo agrega si es nuevo, o actualiza precio/stock/nombre si ya existía
   * (mismo id). Así el catálogo muestra los productos de la base de
   * datos real junto a los de ejemplo.
   */
  mergeProductoReal(producto: Product): void {
    const productos = this.leerDB();
    const idx = productos.findIndex((p) => p.id === producto.id);
    if (idx >= 0) {
      productos[idx] = { ...productos[idx], ...producto };
    } else {
      productos.push(producto);
    }
    this.guardarDB(productos);
  }

  listarProductos(filtro: FiltroProductos = {}): Product[] {
    let productos = this.leerDB();
    if (filtro.categoria) productos = productos.filter((p) => p.categoria === filtro.categoria);
    if (filtro.tipo) productos = productos.filter((p) => p.tipo === filtro.tipo);
    if (filtro.busqueda) {
      const q = filtro.busqueda.toLowerCase();
      productos = productos.filter((p) => p.nombre.toLowerCase().includes(q));
    }
    if (filtro.orden === 'precio-asc') productos = [...productos].sort((a, b) => a.precio - b.precio);
    if (filtro.orden === 'precio-desc') productos = [...productos].sort((a, b) => b.precio - a.precio);
    if (filtro.orden === 'rating') productos = [...productos].sort((a, b) => b.rating - a.rating);
    return productos;
  }

  obtenerProducto(id: string): Product | null {
    return this.leerDB().find((p) => p.id === id) || null;
  }

  stockDisponible(producto: Product, talla?: string | null): number {
    if (producto.tipo === 'prenda') return (talla ? producto.tallas?.[talla] : undefined) ?? 0;
    return producto.stock ?? 0;
  }

  hayExistencias(producto: Product): boolean {
    if (producto.tipo === 'prenda') {
      return Object.values(producto.tallas || {}).some((n) => n > 0);
    }
    return (producto.stock ?? 0) > 0;
  }

  descontarStock(id: string, talla: string | null, cantidad: number): { ok: boolean; error?: string } {
    const productos = this.leerDB();
    const p = productos.find((x) => x.id === id);
    if (!p) return { ok: false, error: 'Producto no existe.' };
    if (p.tipo === 'prenda' && talla) {
      if ((p.tallas?.[talla] ?? 0) < cantidad) return { ok: false, error: 'Sin existencias suficientes.' };
      p.tallas![talla] -= cantidad;
    } else {
      if ((p.stock ?? 0) < cantidad) return { ok: false, error: 'Sin existencias suficientes.' };
      p.stock = (p.stock ?? 0) - cantidad;
    }
    this.guardarDB(productos);
    return { ok: true };
  }

  agregarResena(id: string, resena: Omit<Review, 'fecha'>): { ok: boolean; producto?: Product } {
    const productos = this.leerDB();
    const p = productos.find((x) => x.id === id);
    if (!p) return { ok: false };
    p.resenas.unshift({ ...resena, fecha: new Date().toISOString().slice(0, 10) });
    const total = p.resenas.reduce((acc, r) => acc + r.estrellas, 0);
    p.rating = Math.round((total / p.resenas.length) * 10) / 10;
    this.guardarDB(productos);
    return { ok: true, producto: p };
  }

  relacionados(producto: Product, max = 4): Product[] {
    return this.leerDB()
      .filter((p) => p.categoria === producto.categoria && p.id !== producto.id)
      .slice(0, max);
  }
}