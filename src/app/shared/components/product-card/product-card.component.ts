import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { UserService } from '../../../core/services/user.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { ToastService } from '../../../core/services/toast.service';
import { NotificationService } from '../../../core/services/notification.service';
import { formatCOP, imagenURL } from '../../../core/services/utils';
import { StarsComponent } from '../stars/stars.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, StarsComponent],
  template: `
    <article class="tarjeta-producto" *ngIf="producto">
      <a [routerLink]="['/producto', producto.id]" class="tarjeta-producto__media">
        <img [src]="imagenURL(producto.imagenes[0])" [alt]="producto.nombre" loading="lazy" />
        <span class="etiqueta etiqueta--promo" *ngIf="enPromo">Promo</span>
        <span class="etiqueta etiqueta--agotado" *ngIf="!disponible">Agotado</span>
      </a>
      <button
        class="boton-deseo"
        [class.activo]="enDeseos"
        (click)="alternarDeseo($event)"
        aria-label="Agregar a lista de deseos"
        title="Lista de deseos"
      >
        <svg viewBox="0 0 24 24">
          <path
            d="M12 21s-7.5-4.6-10.2-9.1C-.3 8 1.4 3.8 5.4 3.2c2.1-.3 4 .7 5.6 2.6C12.6 3.9 14.5 2.9 16.6 3.2c4 .6 5.7 4.8 3.6 8.7C19.5 16.4 12 21 12 21z"
          />
        </svg>
      </button>
      <div class="tarjeta-producto__cuerpo">
        <span class="insignia" [class.insignia--prenda]="producto.tipo === 'prenda'" [class.insignia--objeto]="producto.tipo === 'objeto'">
          {{ producto.tipo === 'prenda' ? 'Prenda' : 'Artículo' }}
        </span>
        <h3><a [routerLink]="['/producto', producto.id]">{{ producto.nombre }}</a></h3>
        <app-stars [rating]="producto.rating"></app-stars>
        <div class="tarjeta-producto__precio">
          <strong>{{ formatCOP(producto.precio) }}</strong>
          <span class="precio-tachado" *ngIf="enPromo">{{ formatCOP(producto.precioOriginal!) }}</span>
        </div>
      </div>
    </article>
  `,
})
export class ProductCardComponent {
  @Input({ required: true }) producto!: Product;
  @Output() deseoCambiado = new EventEmitter<void>();

  private productService = inject(ProductService);
  private userService = inject(UserService);
  private wishlistService = inject(WishlistService);
  private toastService = inject(ToastService);
  private notificationService = inject(NotificationService);

  formatCOP = formatCOP;
  imagenURL = imagenURL;

  get disponible(): boolean {
    return this.productService.hayExistencias(this.producto);
  }

  get enPromo(): boolean {
    return !!(this.producto.precioOriginal && this.producto.precioOriginal > this.producto.precio);
  }

  get enDeseos(): boolean {
    const usuario = this.userService.usuarioActual();
    return !!usuario && this.wishlistService.estaEnLista(usuario.id, this.producto.id);
  }

  /**
   * Alterna el producto en la lista de deseos.
   *
   * ⚠️ 100% frontend — ya NO depende de favorites-api ni history-api
   * (el servicio real de favoritos está caído/roto vía gateway, ver
   * hilo de debugging). Todo lo que ves acá (ícono, contador del
   * header y la pestaña "Notificaciones") se llena solo con
   * WishlistService + NotificationService, ambos locales
   * (localStorage). Cuando el backend de favoritos quede estable, acá
   * es donde se vuelve a conectar favoritesApi.agregar()/eliminar().
   */
  alternarDeseo(evento: Event): void {
    evento.preventDefault();
    const usuario = this.userService.usuarioActual();
    if (!usuario) {
      this.toastService.mostrar('Inicia sesión para guardar en tu lista de deseos.', 'advertencia');
      return;
    }

    const agregado = this.wishlistService.alternar(usuario.id, this.producto.id);
    this.toastService.mostrar(
      agregado ? 'Agregado a tu lista de deseos.' : 'Se quitó de tu lista de deseos.',
      'exito'
    );

    // 🔔 Notificación local — esto es lo que llena la pestaña
    // "Notificaciones" y su contador cada vez que se da clic.
    this.notificationService.enviar(usuario.id, {
      titulo: agregado ? 'Agregado a lista de deseos' : 'Quitado de lista de deseos',
      mensaje: agregado
        ? `Guardaste "${this.producto.nombre}" en tu lista de deseos.`
        : `Quitaste "${this.producto.nombre}" de tu lista de deseos.`,
      tipo: 'general',
    });

    this.deseoCambiado.emit();
  }
}