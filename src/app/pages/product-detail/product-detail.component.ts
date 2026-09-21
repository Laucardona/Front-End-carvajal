import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { UserService } from '../../core/services/user.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { formatCOP, imagenURL } from '../../core/services/utils';
import { StarsComponent } from '../../shared/components/stars/stars.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { WhatsappButtonComponent } from '../../shared/components/whatsapp-button/whatsapp-button.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, StarsComponent, ProductCardComponent, WhatsappButtonComponent],
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private userService = inject(UserService);
  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);

  formatCOP = formatCOP;
  imagenURL = imagenURL;

  producto: Product | null = null;
  categoriaNombre = '';
  imagenPrincipal = '';
  tallaSeleccionada: string | null = null;
  cantidadSeleccionada = 1;
  relacionados: Product[] = [];

  estrellasForm = 0;
  textoResena = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id')!;
      this.cargar(id);
    });
  }

  private cargar(id: string): void {
    this.producto = this.productService.obtenerProducto(id);
    if (!this.producto) return;

    this.tallaSeleccionada = null;
    this.cantidadSeleccionada = 1;
    this.estrellasForm = 0;
    this.textoResena = '';
    this.imagenPrincipal = imagenURL(this.producto.imagenes[0], 800, 800);
    this.categoriaNombre =
      this.productService.listarCategorias().find((c) => c.id === this.producto!.categoria)?.nombre || '';
    this.relacionados = this.productService.relacionados(this.producto);

    const usuario = this.userService.usuarioActual();
    if (usuario) this.wishlistService.registrarVisita(usuario.id, this.producto.id);
  }

  get disponible(): boolean {
    return !!this.producto && this.productService.hayExistencias(this.producto);
  }

  get enPromo(): boolean {
    return !!(this.producto?.precioOriginal && this.producto.precioOriginal > this.producto.precio);
  }

  get enDeseos(): boolean {
    const usuario = this.userService.usuarioActual();
    return !!usuario && !!this.producto && this.wishlistService.estaEnLista(usuario.id, this.producto.id);
  }

  get tallasEntries(): [string, number][] {
    return Object.entries(this.producto?.tallas || {});
  }

  cambiarImagen(seed: string): void {
    this.imagenPrincipal = imagenURL(seed, 800, 800);
  }

  seleccionarTalla(talla: string, stock: number): void {
    if (stock === 0) return;
    this.tallaSeleccionada = talla;
    this.cantidadSeleccionada = 1;
  }

  private maxDisponible(): number {
    if (!this.producto) return 1;
    if (this.producto.tipo === 'prenda') {
      return this.tallaSeleccionada ? this.producto.tallas?.[this.tallaSeleccionada] ?? 0 : 99;
    }
    return this.producto.stock ?? 0;
  }

  sumarCantidad(): void {
    if (this.cantidadSeleccionada < this.maxDisponible()) this.cantidadSeleccionada++;
  }

  restarCantidad(): void {
    if (this.cantidadSeleccionada > 1) this.cantidadSeleccionada--;
  }

  agregarAlCarrito(): void {
    if (!this.producto) return;
    const usuario = this.userService.usuarioActual();
    if (!usuario) {
      this.toastService.mostrar('Inicia sesión para agregar al carrito.', 'advertencia');
      return;
    }
    if (this.producto.tipo === 'prenda' && !this.tallaSeleccionada) {
      this.toastService.mostrar('Selecciona una talla antes de continuar.', 'advertencia');
      return;
    }
    this.cartService.agregar(usuario.id, {
      idProducto: this.producto.id,
      talla: this.tallaSeleccionada,
      cantidad: this.cantidadSeleccionada,
    });
    this.toastService.mostrar('Producto agregado al carrito.', 'exito');
  }

  alternarDeseo(): void {
    const usuario = this.userService.usuarioActual();
    if (!usuario || !this.producto) {
      this.toastService.mostrar('Inicia sesión para guardar en tu lista de deseos.', 'advertencia');
      return;
    }
    this.wishlistService.alternar(usuario.id, this.producto.id);
  }

  compartirWhatsApp(): void {
    if (!this.producto) return;
    const texto = `Mira este producto en E-commerce: ${this.producto.nombre} — ${window.location.href}`;
    window.open('https://wa.me/?text=' + encodeURIComponent(texto), '_blank');
  }

  copiarEnlace(): void {
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.toastService.mostrar('Enlace copiado al portapapeles.', 'exito');
    });
  }

  seleccionarEstrellas(n: number): void {
    this.estrellasForm = n;
  }

  enviarResena(): void {
    if (!this.producto) return;
    const usuario = this.userService.usuarioActual();
    if (!usuario) {
      this.toastService.mostrar('Inicia sesión para dejar una reseña.', 'advertencia');
      return;
    }
    const texto = this.textoResena.trim();
    if (!this.estrellasForm || !texto) {
      this.toastService.mostrar('Selecciona una calificación y escribe un comentario.', 'advertencia');
      return;
    }
    this.productService.agregarResena(this.producto.id, {
      usuario: usuario.nombre,
      estrellas: this.estrellasForm,
      texto,
    });
    this.toastService.mostrar('¡Gracias por tu reseña!', 'exito');
    this.cargar(this.producto.id);
  }
}
