import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AppliedCoupon, CartItem, Order, OrderItem, Product, User } from '../../core/models/product.model';
import { UserService } from '../../core/services/user.service';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';
import { ShippingService, CalculoEnvio } from '../../core/services/shipping.service';
import { PaymentService } from '../../core/services/payment.service';
import { OrderService } from '../../core/services/order.service';
import { formatCOP, imagenURL } from '../../core/services/utils';

interface ItemVista {
  item: CartItem;
  producto: Product;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent {
  private userService = inject(UserService);
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private shippingService = inject(ShippingService);
  private paymentService = inject(PaymentService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  formatCOP = formatCOP;
  imagenURL = imagenURL;

  usuario: User | null = null;
  items: ItemVista[] = [];
  ciudad = 'Armenia';
  cupon: AppliedCoupon | null = null;

  metodo: 'tarjeta' | 'pse' | 'contraentrega' = 'tarjeta';
  numeroTarjeta = '';
  vencimiento = '';
  cvv = '';
  direccion = '';
  error = '';
  procesando = false;

  pedidoConfirmado: Order | null = null;

  constructor() {
    this.usuario = this.userService.usuarioActual();
    if (!this.usuario) {
      this.router.navigate(['/login'], { queryParams: { volver: '/checkout' } });
      return;
    }

    this.ciudad = sessionStorage.getItem('ecommerce_checkout_ciudad') || this.usuario.ciudad || 'Armenia';
    const cuponGuardado = sessionStorage.getItem('ecommerce_checkout_cupon');
    this.cupon = cuponGuardado ? JSON.parse(cuponGuardado) : null;

    const items = this.cartService.obtener(this.usuario.id);
    this.items = items
      .map((item) => {
        const producto = this.productService.obtenerProducto(item.idProducto);
        return producto ? { item, producto } : null;
      })
      .filter((v): v is ItemVista => !!v);
  }

  get subtotal(): number {
    return this.usuario ? this.cartService.calcularSubtotal(this.usuario.id) : 0;
  }

  get envio(): CalculoEnvio {
    return this.shippingService.calcular(this.ciudad, !!this.cupon && this.cupon.tipo === 'envio');
  }

  get descuento(): number {
    return this.cupon ? this.cartService.aplicarDescuento(this.subtotal, this.cupon) : 0;
  }

  get total(): number {
    return this.subtotal - this.descuento + this.envio.costo;
  }

  async pagar(): Promise<void> {
    if (!this.usuario) return;
    this.error = '';

    if (!this.direccion.trim()) {
      this.error = 'Ingresa una dirección de entrega.';
      return;
    }

    if (this.metodo === 'tarjeta') {
      const errorTarjeta = this.paymentService.validarTarjeta(this.numeroTarjeta, this.vencimiento, this.cvv);
      if (errorTarjeta) {
        this.error = errorTarjeta;
        return;
      }
    }

    this.procesando = true;
    const total = this.total;
    const resultado = await this.paymentService.procesar({
      idUsuario: this.usuario.id,
      metodo: this.metodo,
      monto: total,
      referencia: 'carrito-' + this.usuario.id,
    });

    const itemsPedido: OrderItem[] = this.items.map((v) => ({
      idProducto: v.item.idProducto,
      talla: v.item.talla,
      cantidad: v.item.cantidad,
      nombre: v.producto.nombre,
      precio: v.producto.precio,
    }));

    const pedido = this.orderService.crear({
      idUsuario: this.usuario.id,
      items: itemsPedido,
      ciudad: this.ciudad,
      costoEnvio: this.envio.costo,
      cupon: this.cupon ? this.cupon.codigo : null,
      subtotal: this.subtotal,
      total,
      idTransaccion: resultado.transaccion.id,
    });

    this.cartService.vaciar(this.usuario.id);
    sessionStorage.removeItem('ecommerce_checkout_ciudad');
    sessionStorage.removeItem('ecommerce_checkout_cupon');

    this.procesando = false;
    this.pedidoConfirmado = pedido;
  }
}
