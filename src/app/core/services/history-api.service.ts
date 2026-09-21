import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FavoriteActionType } from '../models/favorite.model';
import { HistoryEvent } from '../models/history.model';

/**
 * Cliente del microservicio `history-service`.
 * Repo: https://github.com/Laucardona/history-service
 *
 * ⚠️ Va vía gateway (gateway-service) — su JwtAuthFilter exige JWT en
 * TODAS las rutas, así que esto SÍ requiere sesión iniciada ahora
 * (antes, llamado directo, no lo pedía). auth.interceptor.ts ya lo
 * manda automáticamente si hay token guardado.
 */
@Injectable({ providedIn: 'root' })
export class HistoryApiService {
  private readonly baseUrl = environment.historyApiUrl;

  constructor(private http: HttpClient) {}

  /** Todos los eventos registrados, del más reciente al más antiguo. */
  listarTodo(): Observable<HistoryEvent[]> {
    return this.http.get<HistoryEvent[]>(this.baseUrl);
  }

  /** Eventos asociados a un item de favoritos puntual. */
  listarPorItem(idItemFavorite: number): Observable<HistoryEvent[]> {
    return this.http.get<HistoryEvent[]>(`${this.baseUrl}/producto/${idItemFavorite}`);
  }

  /**
   * Registra un evento vía HTTP.
   *
   * ⚠️ Usa el endpoint `/test`, documentado como TEMPORAL mientras no
   * exista un `POST /api/historico` oficial — el propio equipo de
   * Histórico pidió que les avisemos si lo vamos a usar como integración
   * real, para que lo rebauticen y le quiten el sufijo `/test`.
   *
   * Solo hace falta llamar esto si Favorite/Wishlist vive en un backend
   * DISTINTO al de Histórico (que es el caso acá, son microservicios
   * separados). Si en algún punto conviven en el mismo proyecto Spring
   * Boot, el registro se haría inyectando `EventoService` directamente
   * en Java, no desde Angular.
   */
  registrarEvento(idItemFavorite: number, action: FavoriteActionType): Observable<string> {
    const params = new HttpParams()
      .set('idItemFavorite', idItemFavorite)
      .set('action', action);
    return this.http.post(`${this.baseUrl}/test`, null, { params, responseType: 'text' });
  }
}
