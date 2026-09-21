import { Injectable, signal } from '@angular/core';
import { Observable, map, tap, catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/product.model';
import { NotificationService } from './notification.service';
import { AuthApiService } from './auth-api.service';
import { UserResponse } from '../models/auth.model';
import { JWT_STORAGE_KEY } from '../interceptors/auth.interceptor';
import { isValidationError } from '../models/api-error.model';

const SESSION_KEY = 'ecommerce_sesion_activa'; // guarda el User local (cache de UserResponse)

interface RegistroResultado {
  ok: boolean;
  error?: string;
  usuario?: User;
}

/** Convierte el UserResponse del backend real al `User` local que usa el resto de la app. */
function mapUserResponse(u: UserResponse, ciudad: string): User {
  return {
    id: String(u.idUser),
    nombre: u.name,
    correo: u.email,
    clave: '', // ya no se guarda la contraseña localmente
    ciudad,
    fechaRegistro: new Date().toISOString(),
  };
}

@Injectable({ providedIn: 'root' })
export class UserService {
  /** Señal reactiva con el usuario autenticado actualmente (o null). */
  readonly usuarioActivo = signal<User | null>(null);

  constructor(
    private notificationService: NotificationService,
    private authApiService: AuthApiService
  ) {
    this.usuarioActivo.set(this.usuarioActual());
  }

  /**
   * Registra un usuario nuevo contra carvajal-users (real).
   * `ciudad` no lo maneja ese backend todavía — se guarda solo localmente,
   * en el `User` que usa el resto de la app (envíos, etc.).
   */
  registrar(datos: {
    nombre: string;
    correo: string;
    clave: string;
    ciudad: string;
    documento: string;
  }): Observable<RegistroResultado> {
    return this.authApiService
      .registrar({
        document: datos.documento,
        name: datos.nombre,
        email: datos.correo,
        password: datos.clave,
      })
      .pipe(
        tap((resp) => {
          localStorage.setItem(JWT_STORAGE_KEY, resp.token);
          const usuario = mapUserResponse(resp.user, datos.ciudad);
          localStorage.setItem(SESSION_KEY, JSON.stringify(usuario));
          this.usuarioActivo.set(usuario);
          this.notificationService.enviar(usuario.id, {
            titulo: '¡Bienvenido a E-commerce!',
            mensaje: `Hola ${usuario.nombre}, tu cuenta fue creada con éxito. Usa el cupón BIENVENIDA para tu primera compra.`,
            tipo: 'cuenta',
          });
        }),
        map((resp) => ({ ok: true, usuario: mapUserResponse(resp.user, datos.ciudad) })),
        catchError((err: unknown) => this.manejarError(err))
      );
  }

  iniciarSesion(correo: string, clave: string, ciudad = 'Armenia'): Observable<RegistroResultado> {
    return this.authApiService.iniciarSesion({ email: correo, password: clave }).pipe(
      tap((resp) => {
        localStorage.setItem(JWT_STORAGE_KEY, resp.token);
        const usuario = mapUserResponse(resp.user, ciudad);
        localStorage.setItem(SESSION_KEY, JSON.stringify(usuario));
        this.usuarioActivo.set(usuario);
      }),
      map((resp) => ({ ok: true, usuario: mapUserResponse(resp.user, ciudad) })),
      catchError((err: unknown) => this.manejarError(err))
    );
  }

  private manejarError(err: unknown): Observable<RegistroResultado> {
    if (err instanceof HttpErrorResponse) {
      const body = err.error;
      if (isValidationError(body)) {
        const primerMensaje = Object.values(body.errors)[0];
        return throwError(() => ({ ok: false, error: primerMensaje ?? 'Datos inválidos.' }));
      }
      if (err.status === 401 || err.status === 403) {
        return throwError(() => ({ ok: false, error: 'Correo o contraseña incorrectos.' }));
      }
      if (body?.message) {
        return throwError(() => ({ ok: false, error: body.message }));
      }
    }
    return throwError(() => ({ ok: false, error: 'No se pudo conectar con el servidor. Intenta de nuevo.' }));
  }

  cerrarSesion(): void {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(JWT_STORAGE_KEY);
    this.usuarioActivo.set(null);
  }

  usuarioActual(): User | null {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  /** Cambios de perfil que no maneja carvajal-users todavía (ej. ciudad) — solo local. */
  actualizarPerfil(id: string, cambios: Partial<User>): RegistroResultado {
    const actual = this.usuarioActual();
    if (!actual || actual.id !== id) return { ok: false, error: 'Usuario no encontrado.' };
    const actualizado = { ...actual, ...cambios };
    localStorage.setItem(SESSION_KEY, JSON.stringify(actualizado));
    this.usuarioActivo.set(actualizado);
    return { ok: true, usuario: actualizado };
  }
}
