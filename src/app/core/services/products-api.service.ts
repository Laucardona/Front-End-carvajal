import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductApiDTO } from '../models/product-api.model';
import { Product } from '../models/product.model';

/**
 * Convierte un producto real de Productos-M al `Product` local que usa
 * toda la UI (catalogo, carrito, etc.). Productos-M solo tiene
 * idProduct/nameProduct/price/stock - los campos que no existen ahi
 * (categoria, tallas, resenas...) se rellenan con valores por defecto
 * para que el resto de la app no se rompa.
 */
function mapProductApiToProduct(dto: ProductApiDTO): Product {
  return {
    id: String(dto.idProduct),
    nombre: dto.nameProduct,
    categoria: 'gimnasio',
    tipo: 'objeto',
    stock: dto.stock,
    precio: dto.price,
    precioOriginal: null,
    // La imagen vive en su propio endpoint binario (GET /{id}/image), no
    // en el listado. Si el producto no tiene imagen cargada, esa URL
    // responderá con error y el <img> del navegador mostrará el ícono
    // roto — aceptable por ahora mientras no carguen fotos de verdad.
    imagenes: [`${environment.productsApiUrl}/${dto.idProduct}/image`],
    descripcion: 'Producto real, conectado desde el microservicio de Productos-M.',
    rating: 0,
    resenas: [],
    destacado: true,
  };
}

/**
 * Cliente del microservicio `Productos-M`.
 * Repo: https://github.com/miguelangelarmeromunoz8-jpg/Productos-M
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