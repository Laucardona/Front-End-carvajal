import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NotificationApiDTO } from '../models/notification-api.model';

/**
 * Cliente del microservicio `notifications`.
 * Repo: https://github.com/johanleandrovcega-byte/notifications
 *
 * Caso principal: avisar al usuario cuando un producto de su wishlist
 * se queda sin stock. El flujo lo dispara Wishlist (cuando detecta,
 * vía Products, que un producto guardado ya no tiene stock), no este
 * servicio — Notifications solo registra y expone la alerta.
 *
 * ⚠️ Va vía gateway (gateway-service) — su JwtAuthFilter exige JWT en
 * TODAS las rutas, así que esto SÍ requiere sesión iniciada ahora.
 */
@Injectable({ providedIn: 'root' })
export class NotificationsApiService {
  private readonly baseUrl = environment.notificationsApiUrl;

  constructor(private http: HttpClient) {}

  /** Crea la notificación de "producto agotado". Sin body, va todo por query params. */
  crearOutOfStock(userId: number, productId: number): Observable<NotificationApiDTO> {
    const params = new HttpParams().set('userId', userId).set('productId', productId);
    return this.http.post<NotificationApiDTO>(`${this.baseUrl}/out-of-stock`, null, { params });
  }

  /** Todas las notificaciones de un usuario, de la más reciente a la más antigua. */
  listarPorUsuario(userId: number): Observable<NotificationApiDTO[]> {
    return this.http.get<NotificationApiDTO[]>(`${this.baseUrl}/user/${userId}`);
  }

  /** Solo las no leídas. */
  listarNoLeidasPorUsuario(userId: number): Observable<NotificationApiDTO[]> {
    return this.http.get<NotificationApiDTO[]>(`${this.baseUrl}/user/${userId}/unread`);
  }

  /** Marca una notificación como leída. */
  marcarLeida(id: number): Observable<NotificationApiDTO> {
    return this.http.patch<NotificationApiDTO>(`${this.baseUrl}/${id}/read`, {});
  }
}
