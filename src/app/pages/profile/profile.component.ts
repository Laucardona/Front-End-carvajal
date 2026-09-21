import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AppNotification, Order, Product, User } from '../../core/models/product.model';
import { UserService } from '../../core/services/user.service';
import { OrderService } from '../../core/services/order.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { NotificationService } from '../../core/services/notification.service';
import { ShippingService, EtapaRastreo } from '../../core/services/shipping.service';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { FavoritesApiService } from '../../core/services/favorites-api.service';
import { HistoryApiService } from '../../core/services/history-api.service';
import { NotificationsApiService } from '../../core/services/notifications-api.service';
import { formatCOP } from '../../core/services/utils';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

type Tab = 'cuenta' | 'pedidos' | 'deseos' | 'historial' | 'notificaciones';

interface PedidoVista {
  pedido: Order;
  linea: EtapaRastreo[];
  etiquetaEstado: string;
  detalleAbierto: boolean;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ProductCardComponent],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  private userService = inject(UserService);
  private orderService = inject(OrderService);
  private wishlistService = inject(WishlistService);
  private notificationService = inject(NotificationService);
  private shippingService = inject(ShippingService);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);
  private favoritesApiService = inject(FavoritesApiService);
  private historyApiService = inject(HistoryApiService);
  private notificationsApiService = inject(NotificationsApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  formatCOP = formatCOP;
  usuario: User | null = null;
  tabActiva: Tab = 'cuenta';

  ciudades = this.shippingService.listarCiudades();
  editarNombre = '';
  editarCiudad = '';

  pedidosVista: PedidoVista[] = [];
  deseos: Product[] = [];
  historial: Product[] = [];
  notificaciones: AppNotification[] = [];

  constructor() {
    this.usuario = this.userService.usuarioActual();
    if (!this.usuario) {
      this.router.navigate(['/login'], { queryParams: { volver: '/perfil' } });
      return;
    }
    this.editarNombre = this.usuario.nombre;
    this.editarCiudad = this.usuario.ciudad;

    this.route.queryParamMap.subscribe((params) => {
      const tab = (params.get('tab') as Tab) || 'cuenta';
      this.cambiarTab(tab);
    });
  }

  cambiarTab(tab: Tab): void {
    this.tabActiva = tab;
    if (tab === 'pedidos') this.cargarPedidos();
    if (tab === 'deseos') this.cargarDeseos();
    if (tab === 'historial') this.cargarHistorial();
    if (tab === 'notificaciones') this.cargarNotificaciones();
  }

  guardarPerfil(): void {
    if (!this.usuario) return;
    this.userService.actualizarPerfil(this.usuario.id, {
      nombre: this.editarNombre.trim(),
      ciudad: this.editarCiudad,
    });
    this.usuario = this.userService.usuarioActual();
    this.toastService.mostrar('Perfil actualizado.', 'exito');
  }

  private cargarPedidos(): void {
    if (!this.usuario) return;
    const pedidos = this.orderService.listarPorUsuario(this.usuario.id);
    this.pedidosVista = pedidos.map((pedido) => {
      const linea = this.shippingService.lineaDeTiempo(pedido.estado);
      const etiquetaEstado = pedido.devolucion
        ? 'Devolución ' + pedido.devolucion.estado.replace('_', ' ')
        : linea.find((l) => l.etapa === pedido.estado)?.etiqueta || '';
      return { pedido, linea, etiquetaEstado, detalleAbierto: false };
    });
  }

  alternarDetalle(vista: PedidoVista): void {
    vista.detalleAbierto = !vista.detalleAbierto;
  }

  solicitarDevolucion(idPedido: string): void {
    const motivo = prompt('Cuéntanos brevemente el motivo de tu devolución:');
    if (!motivo) return;
    this.orderService.solicitarDevolucion(idPedido, motivo);
    this.toastService.mostrar('Solicitud de devolución enviada.', 'exito');
    this.cargarPedidos();
  }

  private cargarDeseos(): void {
    if (!this.usuario) return;
    // Vista actual (local/mock) — sigue alimentando la UI mientras
    // conectamos favorites de verdad (ids reales vienen de Productos-M,
    // no coinciden con los ids locales de seed-data todavía).
    const ids = this.wishlistService.listar(this.usuario.id);
    this.deseos = ids.map((id) => this.productService.obtenerProducto(id)).filter((p): p is Product => !!p);

    // 🔌 Petición real a carvajal-favorites — esta es la que vas a ver
    // en el Network tab (Fetch/XHR). Sin JWT todavía, así que hoy va a
    // fallar con 401/403 (el api-error.interceptor te muestra el toast).
    // Cuando tengamos login real, quitamos el bloque de arriba y usamos
    // esta respuesta para pintar la UI.
    this.favoritesApiService.listar().subscribe({
      next: (favoritos) => console.log('[favorites-api] GET /favorites →', favoritos),
      error: (err) => console.warn('[favorites-api] GET /favorites falló →', err),
    });
  }

  private cargarHistorial(): void {
    if (!this.usuario) return;
    const ids = this.wishlistService.historial(this.usuario.id);
    this.historial = ids.map((id) => this.productService.obtenerProducto(id)).filter((p): p is Product => !!p);

    // 🔌 Petición real a history-service (no requiere JWT). Trackea
    // acciones sobre items de FAVORITOS (agregado/actualizado/eliminado),
    // no "productos vistos" como esta pestaña local — por eso solo se
    // loguea, todavía no reemplaza la UI de arriba.
    this.historyApiService.listarTodo().subscribe({
      next: (eventos) => console.log('[history-api] GET /api/historico →', eventos),
      error: (err) => console.warn('[history-api] GET /api/historico falló →', err),
    });
  }

  private cargarNotificaciones(): void {
    if (!this.usuario) return;
    this.notificaciones = this.notificationService.listar(this.usuario.id);
    this.notificationService.marcarTodasLeidas(this.usuario.id);

    // 🔌 Petición real a notifications (no requiere JWT). Espera un
    // userId NUMÉRICO — nuestro usuario local usa un id string
    // ('u' + timestamp), así que todavía no hay forma de mapear un
    // usuario real al userId que este servicio espera. Por ahora la
    // disparo con userId=1 (el mismo que usa el PDF de ejemplo) solo
    // para confirmar la conexión — ajustar en cuanto haya un id numérico
    // real por usuario (ligado al futuro auth-service).
    this.notificationsApiService.listarPorUsuario(1).subscribe({
      next: (notifs) => console.log('[notifications-api] GET /user/1 →', notifs),
      error: (err) => console.warn('[notifications-api] GET /user/1 falló →', err),
    });
  }

  iconoTipo(tipo: string): string {
    const iconos: Record<string, string> = {
      cuenta: 'M12 12a5 5 0 100-10 5 5 0 000 10zM4 21a8 8 0 0116 0',
      pedido: 'M3 3h2l2.4 12.4a2 2 0 002 1.6h8.4a2 2 0 002-1.6L21 8H6',
      rastreo: 'M13 5l7 7-7 7M5 12h15',
      devolucion: 'M4 4v6h6M20 20v-6h-6M4 10a8 8 0 0114-4.9M20 14a8 8 0 01-14 4.9',
      general: 'M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9',
    };
    return iconos[tipo] || iconos['general'];
  }

  cerrarSesion(): void {
    this.userService.cerrarSesion();
    this.router.navigateByUrl('/');
  }
}
