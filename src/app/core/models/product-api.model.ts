/**
 * ✅ Confirmado contra la respuesta real de GET /api/products.
 * La imagen NO viene en este listado — vive en su propio endpoint
 * GET /api/products/{id}/image (binario), ver products-api.service.ts.
 */
export interface ProductApiDTO {
  idProduct: number;
  nameProduct: string;
  price: number;
  stock: number;
  idUser?: number;
}