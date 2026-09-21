import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Category, Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { ProductsApiService } from '../../core/services/products-api.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ProductCardComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private productService = inject(ProductService);
  private productsApiService = inject(ProductsApiService);
  private route = inject(ActivatedRoute);

  categorias: Category[] = this.productService.listarCategorias();
  categoriaActiva = '';
  busquedaActiva = '';
  tipoFiltro = '';
  ordenFiltro: 'precio-asc' | 'precio-desc' | 'rating' | '' = '';

  catalogo: Product[] = [];
  destacados: Product[] = this.productService.listarProductos().filter((p) => p.destacado);
  tituloCatalogo = 'Catálogo completo';

  get todasLasCategorias() {
    return [{ id: '', nombre: 'Todo' } as Category, ...this.categorias];
  }

  constructor() {
    this.route.queryParamMap.subscribe((params) => {
      this.categoriaActiva = params.get('categoria') || '';
      this.busquedaActiva = params.get('buscar') || '';
      this.renderCatalogo();
    });

    // 🔌 Petición real a Productos-M (no requiere JWT). El catálogo que
    // se ve en pantalla sigue siendo el local (seed-data): el shape real
    // de ProductApiDTO no está confirmado y este catálogo depende de
    // campos que la API probablemente no trae (tallas, imágenes múltiples,
    // reseñas...). Por ahora solo la disparamos y la logueamos para que
    // se vea la petición real en Network — pégame la respuesta real
    // cuando la veas y la conecto de verdad al catálogo.
    this.productsApiService.listar().subscribe({
      next: (productos) => console.log('[products-api] GET /api/products →', productos),
      error: (err) => console.warn('[products-api] GET /api/products falló →', err),
    });
  }

  seleccionarCategoria(id: string): void {
    this.categoriaActiva = id;
    this.busquedaActiva = '';
    this.renderCatalogo();
  }

  renderCatalogo(): void {
    this.catalogo = this.productService.listarProductos({
      categoria: this.categoriaActiva || undefined,
      tipo: this.tipoFiltro || undefined,
      busqueda: this.busquedaActiva || undefined,
      orden: this.ordenFiltro || undefined,
    });
    if (this.busquedaActiva) {
      this.tituloCatalogo = `Resultados para "${this.busquedaActiva}" (${this.catalogo.length})`;
    } else if (this.categoriaActiva) {
      this.tituloCatalogo = this.categorias.find((c) => c.id === this.categoriaActiva)?.nombre || 'Catálogo';
    } else {
      this.tituloCatalogo = 'Catálogo completo';
    }
  }
}
