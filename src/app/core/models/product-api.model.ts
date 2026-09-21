/**
 * ⚠️ PROVISIONAL — sin confirmar contra el equipo de Productos-M.
 *
 * Solo tenemos la URL del endpoint (GET /api/products), no una guía de
 * integración como las de favorites/history/notifications, y el sitio
 * de Render bloquea el acceso automático para poder inspeccionar la
 * respuesta real.
 *
 * Los campos de abajo son mi mejor estimación combinando:
 *  - lo que favorites.FavoriteResponseDTO ya espera de un producto
 *    (idProduct: number, nameProduct, price, stockAvailable), y
 *  - los campos que hoy usa el `Product` local (core/models/product.model.ts).
 *
 * Antes de usar products-api.service.ts en un componente real:
 *  1. Pega la respuesta real de GET https://productos-m.onrender.com/api/products
 *     (o su Swagger si el repo lo trae), y
 *  2. Ajustamos este modelo y el mapeo en products-api.service.ts.
 */
export interface ProductApiDTO {
  idProduct: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  imageUrl?: string;
}
