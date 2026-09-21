import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';

/**
 * Cliente del microservicio `carvajal-users` — el auth-service central
 * que faltaba. `/register` y `/login` son públicos (no requieren JWT,
 * ver su SecurityConfig: `.requestMatchers("/api/auth/**").permitAll()`).
 *
 * ✅ Ya resuelto: este servicio firma el JWT con
 * subject(String.valueOf(user.getIdUser())), igual que favorites lo espera.
 *
 * ⚠️ CORS: revisar que la variable CORS_ALLOWED_ORIGINS en Render incluya
 * TANTO http://localhost:4200 COMO el dominio de producción — si solo
 * tiene uno de los dos, el otro entorno va a seguir fallando por CORS.
 */
@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly baseUrl = environment.authApiUrl;

  constructor(private http: HttpClient) {}

  registrar(dto: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, dto);
  }

  iniciarSesion(dto: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, dto);
  }
}
