/**
 * Entorno de PRODUCCIÓN.
 * Mismas URLs de Render (favorites/productos/historico/notifications
 * vía gateway; auth directo — ver environment.ts para el detalle).
 */
const gatewayUrl = 'https://gateway-service-bt2d.onrender.com';

export const environment = {
  production: true,

  authApiUrl: 'https://carvajal-users.onrender.com/api/auth',
  favoritesApiUrl: `${gatewayUrl}/api/v1/favorites`,
  productsApiUrl: `${gatewayUrl}/api/products`,
  historyApiUrl: `${gatewayUrl}/api/historico`,
  notificationsApiUrl: `${gatewayUrl}/api/notifications`,
};
