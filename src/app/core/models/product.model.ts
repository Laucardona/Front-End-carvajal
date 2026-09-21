export interface Review {
  usuario: string;
  estrellas: number;
  texto: string;
  fecha: string;
}

export interface Product {
  id: string;
  nombre: string;
  categoria: string;
  tipo: 'prenda' | 'objeto';
  tallas?: Record<string, number>;
  stock?: number;
  precio: number;
  precioOriginal?: number | null;
  imagenes: string[];
  descripcion: string;
  rating: number;
  resenas: Review[];
  destacado: boolean;
}

export interface Category {
  id: string;
  nombre: string;
}

export interface City {
  ciudad: string;
  distanciaKm: number;
  costo: number;
  dias: string;
}

export interface Coupon {
  tipo: 'porcentaje' | 'envio';
  valor: number;
  descripcion: string;
}

export interface AppliedCoupon extends Coupon {
  codigo: string;
}

export interface User {
  id: string;
  nombre: string;
  correo: string;
  clave: string;
  ciudad: string;
  fechaRegistro: string;
}

export interface CartItem {
  idProducto: string;
  talla: string | null;
  cantidad: number;
}

export interface OrderItem {
  idProducto: string;
  talla: string | null;
  cantidad: number;
  nombre: string;
  precio: number;
}

export interface Refund {
  motivo: string;
  estado: string;
  fecha: string;
}

export interface Order {
  id: string;
  idUsuario: string;
  items: OrderItem[];
  ciudad: string;
  costoEnvio: number;
  cupon: string | null;
  subtotal: number;
  total: number;
  idTransaccion: string;
  estado: 'confirmado' | 'preparando' | 'en_camino' | 'entregado';
  fecha: string;
  devolucion: Refund | null;
}

export interface AppNotification {
  id: string;
  titulo: string;
  mensaje: string;
  tipo: 'cuenta' | 'pedido' | 'rastreo' | 'devolucion' | 'general';
  fecha: string;
  leida: boolean;
}

export interface Transaction {
  id: string;
  idUsuario: string;
  metodo: string;
  monto: number;
  referencia: string;
  estado: string;
  fecha: string;
}
