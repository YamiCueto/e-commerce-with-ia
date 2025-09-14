import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand?: string;
  image: string;
  images: string[];
  rating: number;
  reviews: number;
  description: string;
  features: string[];
  specifications: { [key: string]: string };
  inStock: boolean;
  stockCount: number;
  featured?: boolean;
  discount?: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);

  private readonly ASSETS_PATH = '/assets/data';

  /**
   * Obtiene todos los productos
   */
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.ASSETS_PATH}/products.json`);
  }

  /**
   * Obtiene un producto por ID
   */
  getProductById(id: number): Observable<Product | undefined> {
    return this.getAllProducts().pipe(
      map(products => products.find(product => product.id === id))
    );
  }

  /**
   * Obtiene productos por categoría
   */
  getProductsByCategory(categoryId: string): Observable<Product[]> {
    return this.getAllProducts().pipe(
      map(products => products.filter(product => product.category === categoryId))
    );
  }

  /**
   * Busca productos por término
   */
  searchProducts(searchTerm: string): Observable<Product[]> {
    return this.getAllProducts().pipe(
      map(products =>
        products.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }

  /**
   * Obtiene productos destacados
   */
  getFeaturedProducts(limit?: number): Observable<Product[]> {
    return this.getAllProducts().pipe(
      map(products => {
        const featured = products.filter(product => product.featured === true);
        if (featured.length > 0) {
          return limit ? featured.slice(0, limit) : featured;
        }
        // Si no hay productos marcados como featured, tomar los primeros
        return limit ? products.slice(0, limit) : products.slice(0, 4);
      })
    );
  }

  /**
   * Obtiene todas las categorías
   */
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.ASSETS_PATH}/categories.json`);
  }

  /**
   * Obtiene una categoría por ID
   */
  getCategoryById(id: string): Observable<Category | undefined> {
    return this.getCategories().pipe(
      map(categories => categories.find(category => category.id === id))
    );
  }

  /**
   * Filtra y ordena productos
   */
  getFilteredProducts(
    categoryId?: string,
    searchTerm?: string,
    sortBy?: string
  ): Observable<Product[]> {
    return this.getAllProducts().pipe(
      map(products => {
        let filtered = products;

        // Filtrar por categoría
        if (categoryId && categoryId !== 'all') {
          filtered = filtered.filter(product => product.category === categoryId);
        }

        // Filtrar por búsqueda
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(term) ||
            product.description.toLowerCase().includes(term) ||
            product.brand?.toLowerCase().includes(term)
          );
        }

        // Ordenar
        if (sortBy) {
          switch (sortBy) {
            case 'price-asc':
              filtered.sort((a, b) => a.price - b.price);
              break;
            case 'price-desc':
              filtered.sort((a, b) => b.price - a.price);
              break;
            case 'name-asc':
              filtered.sort((a, b) => a.name.localeCompare(b.name));
              break;
            case 'name-desc':
              filtered.sort((a, b) => b.name.localeCompare(a.name));
              break;
            case 'rating':
              filtered.sort((a, b) => b.rating - a.rating);
              break;
            default:
              // Por defecto, ordenar por ID (orden natural)
              filtered.sort((a, b) => a.id - b.id);
          }
        }

        return filtered;
      })
    );
  }
}
