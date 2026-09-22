import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { UserService } from '../../../core/services/user.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { ToastService } from '../../../core/services/toast.service';
import { FavoritesApiService } from '../../../core/services/favorites-api.service';
import { HistoryApiService } from '../../../core/services/history-api.service';
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
  private favoritesApi = inject(FavoritesApiService);
  private historyApi = inject(HistoryApiService);

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

  alternarDeseo(evento: Event): void {
    evento.preventDefault();
    const usuario = this.userService.usuarioActual();
    if (!usuario) {
      this.toastService.mostrar('Inicia sesión para guardar en tu lista de deseos.', 'advertencia');
      return;
    }

    // Vista local (mock) — sigue alimentando el ícono/contador al instante.
    const agregado = this.wishlistService.alternar(usuario.id, this.producto.id);
    this.toastService.mostrar(
      agregado ? 'Agregado a tu lista de deseos.' : 'Se quitó de tu lista de deseos.',
      'exito'
    );
    this.deseoCambiado.emit();

    // 🔌 Llamada real a carvajal-favorites (POST) — requiere sesión (JWT).
    // Si el producto se quitó (agregado === false) no mandamos DELETE
    // porque la vista local no guarda el idItemFavorite numérico del
    // backend; solo registramos el alta real.
    if (!agregado) return;

    const idProductoNumerico = Number(this.producto.id);
    if (Number.isNaN(idProductoNumerico)) {
      console.warn('[favorites-api] id de producto no numérico, se omite POST →', this.producto.id);
      return;
    }

    this.favoritesApi.agregar({ idProduct: idProductoNumerico }).subscribe({
      next: (resp) => {
        console.log('[favorites-api] POST /favorites →', resp);

        // 🔌 Encadenado: registra el evento en history-service (POST /test).
        this.historyApi.registrarEvento(resp.idItemFavorite, 'AGREGADO').subscribe({
          next: (r) => console.log('[history-api] POST /historico/test →', r),
          error: (err) => console.warn('[history-api] POST falló →', err),
        });
      },
      error: (err) => console.warn('[favorites-api] POST falló →', err),
    });
  }
}