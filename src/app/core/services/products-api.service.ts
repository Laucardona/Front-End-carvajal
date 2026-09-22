import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductApiDTO } from '../models/product-api.model';
import { Product } from '../models/product.model';

/**
 * Convierte un producto real de Productos-M al `Product` local que usa
 * toda la UI (catalogo, carrito, etc.). Productos-M solo tiene
 * idProduct/nameProduct/price/stock/imageUrl - los campos que no
 * existen ahi (categoria, tallas, resenas...) se rellenan con
 * valores por defecto para que el resto de la app no se rompa.
 */
function mapProductApiToProduct(dto: ProductApiDTO): Product {
  return {
    id: String(dto.idProduct),
    nombre: dto.name,
    categoria: dto.category || 'gimnasio',
    tipo: 'objeto',
    stock: dto.stock,
    precio: dto.price,
    precioOriginal: null,
    imagenes: [dto.imageUrl || 'https://placehold.co/600x600?text=Producto'],
    descripcion: dto.description || 'Producto real, conectado desde el microservicio de Productos-M.',
    rating: 0,
    resenas: [],
    destacado: true,
  };
}

/**
 * Cliente del microservicio `Productos-M`.
 * Repo: https://github.com/miguelangelarmeromunoz8-jpg/Productos-M
 *
 * ⚠️ A diferencia de favorites/history/notifications, de este servicio
 * solo tenemos la URL del endpoint — no una guía de integración, así
 * que `ProductApiDTO` (core/models/product-api.model.ts) es una
 * estimación sin confirmar. Antes de conectar esto a un componente real
 * (por ejemplo reemplazar product.service.ts), hay que:
 *   1. Confirmar el shape real de la respuesta (pega el JSON que
 *      devuelve GET /api/products, o el Swagger si el repo lo trae), y
 *   2. Confirmar si tiene GET por id, POST, PUT, DELETE, y si requiere JWT.
 * Por ahora solo implemento el único endpoint documentado (`listar`).
 */
@Injectable({ providedIn: 'root' })
export class ProductsApiService {
  private readonly baseUrl = environment.productsApiUrl;

  constructor(private http: HttpClient) {}

  listar(): Observable<ProductApiDTO[]> {
    return this.http.get<ProductApiDTO[]>(this.baseUrl);
  }

  /** Igual que listar(), pero ya convertido al modelo `Product` local. */
  listarComoProducts(): Observable<Product[]> {
    return this.listar().pipe(map((productos) => productos.map(mapProductApiToProduct)));
  }
}