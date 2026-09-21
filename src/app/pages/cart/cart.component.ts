import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AppliedCoupon, CartItem, Product, User } from '../../core/models/product.model';
import { UserService } from '../../core/services/user.service';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';
import { ShippingService, CalculoEnvio } from '../../core/services/shipping.service';
import { ToastService } from '../../core/services/toast.service';
import { formatCOP, imagenURL } from '../../core/services/utils';

interface ItemVista {
  item: CartItem;
  producto: Product;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  private userService = inject(UserService);
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private shippingService = inject(ShippingService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  formatCOP = formatCOP;
  imagenURL = imagenURL;

  usuario: User | null = null;
  items: ItemVista[] = [];
  ciudades = this.shippingService.listarCiudades();
  ciudadSeleccionada = 'Armenia';
  codigoCupon = '';
  cuponAplicado: AppliedCoupon | null = null;

  constructor() {
    this.usuario = this.userService.usuarioActual();
    if (!this.usuario) {
      this.router.navigate(['/login'], { queryParams: { volver: '/carrito' } });
      return;
    }
    this.ciudadSeleccionada = this.usuario.ciudad || 'Armenia';
    this.cargar();
  }

  private cargar(): void {
    if (!this.usuario) return;
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
    const envioGratisPorCupon = !!this.cuponAplicado && this.cuponAplicado.tipo === 'envio';
    return this.shippingService.calcular(this.ciudadSeleccionada, envioGratisPorCupon);
  }

  get descuento(): number {
    return this.cuponAplicado ? this.cartService.aplicarDescuento(this.subtotal, this.cuponAplicado) : 0;
  }

  get total(): number {
    return this.subtotal - this.descuento + this.envio.costo;
  }

  sumar(item: CartItem): void {
    if (!this.usuario) return;
    this.cartService.actualizarCantidad(this.usuario.id, item.idProducto, item.talla, item.cantidad + 1);
    this.cargar();
  }

  restar(item: CartItem): void {
    if (!this.usuario) return;
    this.cartService.actualizarCantidad(this.usuario.id, item.idProducto, item.talla, item.cantidad - 1);
    this.cargar();
  }

  eliminar(item: CartItem): void {
    if (!this.usuario) return;
    this.cartService.eliminar(this.usuario.id, item.idProducto, item.talla);
    this.toastService.mostrar('Producto eliminado del carrito.', 'info');
    this.cargar();
  }

  aplicarCupon(): void {
    const cupon = this.cartService.validarCupon(this.codigoCupon.trim());
    if (!cupon) {
      this.toastService.mostrar('Ese cupón no existe o ya expiró.', 'advertencia');
      return;
    }
    this.cuponAplicado = cupon;
    this.toastService.mostrar('Cupón aplicado correctamente.', 'exito');
  }

  irAPagar(): void {
    sessionStorage.setItem('ecommerce_checkout_ciudad', this.ciudadSeleccionada);
    sessionStorage.setItem('ecommerce_checkout_cupon', this.cuponAplicado ? JSON.stringify(this.cuponAplicado) : '');
    this.router.navigateByUrl('/checkout');
  }

  compartirCarrito(): void {
    if (!this.usuario) return;
    const enlace = this.cartService.enlaceCompartir(this.usuario.id);
    if (enlace) window.open(enlace, '_blank');
  }
}
