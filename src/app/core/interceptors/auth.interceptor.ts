import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

/**
 * Clave donde se guarda el JWT en localStorage.
 *
 * ⚠️ Hoy no existe un auth-service real conectado (UserService sigue
 * usando localStorage con usuarios simulados, ver user.service.ts), así
 * que este token no se está emitiendo todavía. En cuanto el equipo de
 * autenticación central despliegue su microservicio:
 *   1. Al hacer login exitoso, guardar el JWT que devuelva con:
 *      localStorage.setItem(JWT_STORAGE_KEY, token)
 *   2. Este interceptor ya lo tomará y lo mandará en cada petición.
 */
export const JWT_STORAGE_KEY = 'ecommerce_jwt_token';

/**
 * Rutas que requieren el header Authorization: Bearer <token>.
 *
 * Antes solo favorites lo exigía. Ahora que TODO pasa por el gateway
 * (gateway-service), su JwtAuthFilter exige JWT en las 4 rutas sin
 * excepción (favorites, productos, histórico, notificaciones) — ver
 * RouteConfig.java del gateway, las 4 tienen .filter(jwtAuthFilter.filter()).
 * authApiUrl NO va aquí: login/registro son las rutas que generan el
 * token, no pueden requerirlo.
 */
const PROTECTED_PREFIXES = [
  environment.favoritesApiUrl,
  environment.productsApiUrl,
  environment.historyApiUrl,
  environment.notificationsApiUrl,
];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const requiresAuth = PROTECTED_PREFIXES.some((prefix) => req.url.startsWith(prefix));
  if (!requiresAuth) return next(req);

  const token = localStorage.getItem(JWT_STORAGE_KEY);
  if (!token) return next(req);

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    })
  );
};
