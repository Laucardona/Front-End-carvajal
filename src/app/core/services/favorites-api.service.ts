import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  FavoriteRequestDTO,
  FavoriteResponseDTO,
  HistoryFavoriteResponseDTO,
} from '../models/favorite.model';

/**
 * Cliente del microservicio `carvajal-favorites` (wishlist real, Spring Boot).
 *
 * Todas las rutas requieren JWT — lo agrega automáticamente
 * `auth.interceptor.ts` mientras el token esté en localStorage bajo
 * `JWT_STORAGE_KEY`. No hace falta mandar `idUser`: el backend lo saca
 * del token.
 *
 * Repo: https://github.com/PrincipeMestizoo/carvajal-favorites
 * Swagger: https://carvajal-favorites.onrender.com/swagger-ui/index.html
 *
 * ⚠️ Cold start (plan free de Render): la primera petición del día puede
 * tardar 30-90s. api-error.interceptor.ts ya muestra un toast avisándolo
 * si la petición falla con status 0.
 *
 * ⚠️ Bug conocido del backend: si `quantity` llega como `null`/`undefined`
 * en el body del POST, el controlador lanza un NullPointerException
 * (`Cannot invoke "Integer.intValue()" because "requestedQuantity" is null`)
 * y responde 500. Mientras el backend no le ponga un default, `agregar()`
 * siempre manda `quantity: 1` cuando no viene especificado, para evitarlo.
 */
@Injectable({ providedIn: 'root' })
export class FavoritesApiService {
  private readonly baseUrl = environment.favoritesApiUrl;

  constructor(private http: HttpClient) {}

  /** Lista todos los items de la wishlist del usuario autenticado. */
  listar(): Observable<FavoriteResponseDTO[]> {
    return this.http.get<FavoriteResponseDTO[]>(this.baseUrl);
  }

  /**
   * Agrega un producto a la wishlist.
   *
   * Fuerza `quantity: 1` por defecto si el llamador no lo especifica,
   * para esquivar el 500 del backend cuando `quantity` llega null.
   */
  agregar(dto: FavoriteRequestDTO): Observable<FavoriteResponseDTO> {
    const payload: FavoriteRequestDTO = {
      ...dto,
      quantity: dto.quantity ?? 1,
    };
    return this.http.post<FavoriteResponseDTO>(this.baseUrl, payload);
  }

  /**
   * Actualiza cantidad y/o producto de un item existente.
   *
   * Mismo resguardo que `agregar()`: si no se manda `quantity`, se
   * fuerza a 1 para evitar el mismo NullPointerException del backend.
   */
  actualizar(idItemFavorite: number, dto: FavoriteRequestDTO): Observable<FavoriteResponseDTO> {
    const payload: FavoriteRequestDTO = {
      ...dto,
      quantity: dto.quantity ?? 1,
    };
    return this.http.put<FavoriteResponseDTO>(`${this.baseUrl}/${idItemFavorite}`, payload);
  }

  /** Elimina un item de la wishlist. */
  eliminar(idItemFavorite: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${idItemFavorite}`);
  }

  /** Histórico de acciones (agregado/actualizado/eliminado) sobre un item. */
  historial(idItemFavorite: number): Observable<HistoryFavoriteResponseDTO[]> {
    return this.http.get<HistoryFavoriteResponseDTO[]>(
      `${this.baseUrl}/${idItemFavorite}/history`
    );
  }
}