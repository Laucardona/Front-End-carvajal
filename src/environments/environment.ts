/**
 * Entorno de DESARROLLO.
 *
 * Favorites, Productos, Histórico y Notificaciones pasan por el
 * API GATEWAY (gateway-service) en vez de llamarse directo.
 *
 * ⚠️ IMPORTANTE: a diferencia de llamarlos directo, el gateway exige
 * JWT en TODAS las rutas (ver RouteConfig.java — las 4 tienen
 * .filter(jwtAuthFilter.filter())). auth.interceptor.ts ya está
 * actualizado para mandar el Bearer a las 4, no solo a favoritos.
 * Si no hay sesión iniciada, las 4 van a responder 401 del gateway
 * (antes, sin gateway, productos/histórico/notificaciones sí
 * respondían sin login).
 *
 * Repo del gateway: https://github.com/Laucardona/gateway-service
 *
 * ⚠️ Todos corren en el plan free de Render: si un servicio estuvo
 * inactivo, la primera petición del día puede tardar 30-90s en responder.
 */
const gatewayUrl = 'https://gateway-service-bt2d.onrender.com';

export const environment = {
  production: false,

  /**
   * Microservicio de autenticación central — carvajal-users.
   * NO pasa por el gateway (RouteConfig no tiene ruta para /api/auth),
   * se sigue llamando directo.
   * Repo: https://github.com/PrincipeMestizoo/carvajal-users
   */
  authApiUrl: 'https://carvajal-users.onrender.com/api/auth',

  /** Wishlist / Favoritos — vía gateway. */
  favoritesApiUrl: `${gatewayUrl}/api/v1/favorites`,

  /**
   * Productos — vía gateway.
   * ⚠️ Solo tenemos confirmado el endpoint GET /api/products (sin doc
   * de shape de respuesta ni de los demás endpoints). Ver el comentario
   * en products-api.service.ts antes de usarlo en un componente real.
   */
  productsApiUrl: `${gatewayUrl}/api/products`,

  /** Histórico de acciones sobre favoritos — vía gateway. */
  historyApiUrl: `${gatewayUrl}/api/historico`,

  /** Notificaciones (alertas de "sin stock" para la wishlist) — vía gateway. */
  notificationsApiUrl: `${gatewayUrl}/api/notifications`,
};
