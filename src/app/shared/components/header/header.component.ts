import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { UserService } from '../../../core/services/user.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="franja-superior">
      Envíos a todo Colombia desde Armenia, Quindío · Compra por WhatsApp disponible
    </div>
    <div class="encabezado">
      <a routerLink="/" class="logo" aria-label="E-commerce, inicio">
        <svg viewBox="0 0 48 48" class="logo__icono">
          <path d="M2 38 L16 14 L22 24 L28 10 L46 38 Z" />
          <path d="M2 38 L16 14 L22 24" class="logo__pico-sombra" />
        </svg>
        <span class="logo__texto">E-COMMERCE</span>
      </a>

      <form class="buscador" role="search" (submit)="buscar($event)">
        <input
          type="search"
          name="buscar"
          [(ngModel)]="terminoBusqueda"
          placeholder="Buscar tenis, balones, bicicletas..."
          aria-label="Buscar productos"
        />
        <button type="submit" aria-label="Buscar">
          <svg viewBox="0 0 24 24"><path d="M21 21l-4.3-4.3M19 11a8 8 0 11-16 0 8 8 0 0116 0z" /></svg>
        </button>
      </form>

      <nav class="acciones-header">
        <a routerLink="/perfil" [queryParams]="{ tab: 'notificaciones' }" class="icono-accion" title="Notificaciones">
          <svg viewBox="0 0 24 24">
            <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" />
          </svg>
          <span class="contador-badge" [style.display]="contadorNotis > 0 ? 'flex' : 'none'">{{ contadorNotis }}</span>
        </a>
        <a routerLink="/perfil" [queryParams]="{ tab: 'deseos' }" class="icono-accion" title="Lista de deseos">
          <svg viewBox="0 0 24 24">
            <path
              d="M12 21s-7.5-4.6-10.2-9.1C-.3 8 1.4 3.8 5.4 3.2c2.1-.3 4 .7 5.6 2.6C12.6 3.9 14.5 2.9 16.6 3.2c4 .6 5.7 4.8 3.6 8.7C19.5 16.4 12 21 12 21z"
            />
          </svg>
          <span class="contador-badge" [style.display]="contadorDeseos > 0 ? 'flex' : 'none'">{{ contadorDeseos }}</span>
        </a>
        <a routerLink="/carrito" class="icono-accion" title="Carrito">
          <svg viewBox="0 0 24 24">
            <path d="M3 3h2l2.4 12.4a2 2 0 002 1.6h8.4a2 2 0 002-1.6L21 8H6" />
            <circle cx="9" cy="21" r="1" />
            <circle cx="18" cy="21" r="1" />
          </svg>
          <span class="contador-badge" [style.display]="cartService.totalItems() > 0 ? 'flex' : 'none'">{{ cartService.totalItems() }}</span>
        </a>
        <a *ngIf="usuario as u; else invitado" routerLink="/perfil" class="usuario-chip" title="Mi perfil">
          <span>{{ u.nombre.split(' ')[0] }}</span>
        </a>
        <ng-template #invitado>
          <a routerLink="/login" class="boton boton--linea">Ingresar</a>
        </ng-template>
      </nav>
    </div>
    <nav class="nav-categorias">
      <a
        *ngFor="let c of categorias"
        [routerLink]="'/'"
        [queryParams]="{ categoria: c.id }"
        fragment="catalogo"
        >{{ c.nombre }}</a
      >
      <a [routerLink]="'/'" fragment="promociones" class="nav-categorias__promo">Promociones</a>
    </nav>
  `,
})
export class HeaderComponent {
  private productService = inject(ProductService);
  private userService = inject(UserService);
  private wishlistService = inject(WishlistService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  cartService = inject(CartService);
  categorias = this.productService.listarCategorias();
  terminoBusqueda = '';

  get usuario() {
    return this.userService.usuarioActivo();
  }

  get contadorDeseos(): number {
    const u = this.usuario;
    return u ? this.wishlistService.listar(u.id).length : 0;
  }

  get contadorNotis(): number {
    const u = this.usuario;
    return u ? this.notificationService.contarNoLeidas(u.id) : 0;
  }

  constructor() {
    this.cartService.refrescarContador(this.userService.usuarioActual()?.id ?? null);
  }

  buscar(evento: Event): void {
    evento.preventDefault();
    this.router.navigate(['/'], { queryParams: { buscar: this.terminoBusqueda }, fragment: 'catalogo' });
  }
}
