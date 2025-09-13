import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  images: string[];
  rating: number;
  reviews: number;
  description: string;
  features: string[];
  specifications: { [key: string]: string };
  inStock: boolean;
  stockCount: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Smartphone Pro Max',
      price: 999.99,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1520923387722-0a5ef9963e33?w=500&h=500&fit=crop'
      ],
      rating: 4.5,
      reviews: 128,
      description: 'El smartphone más avanzado con tecnología de punta, diseño elegante y rendimiento excepcional.',
      features: [
        'Pantalla OLED de 6.7 pulgadas',
        'Procesador A17 Pro',
        'Sistema de cámaras triple',
        'Batería de larga duración',
        'Resistente al agua IP68',
        '5G Ultra-rápido'
      ],
      specifications: {
        'Pantalla': '6.7" Super Retina XDR OLED',
        'Procesador': 'A17 Pro chip',
        'Memoria': '256GB',
        'RAM': '8GB',
        'Cámara': '48MP + 12MP + 12MP',
        'Batería': '4422 mAh',
        'OS': 'iOS 17'
      },
      inStock: true,
      stockCount: 15
    },
    {
      id: 2,
      name: 'Laptop Gaming',
      price: 1299.99,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop'
      ],
      rating: 4.8,
      reviews: 89,
      description: 'Laptop para gaming de alto rendimiento con las mejores especificaciones.',
      features: [
        'Procesador Intel i7',
        'Tarjeta gráfica RTX 4060',
        'RAM 16GB DDR4',
        'SSD 1TB',
        'Pantalla 144Hz'
      ],
      specifications: {
        'Procesador': 'Intel Core i7-12700H',
        'GPU': 'NVIDIA RTX 4060',
        'RAM': '16GB DDR4',
        'Almacenamiento': '1TB SSD',
        'Pantalla': '15.6" 144Hz'
      },
      inStock: true,
      stockCount: 8
    },
    // Más productos...
  ];

  private categories: Category[] = [
    {
      id: 'electronics',
      name: 'Electrónicos',
      icon: 'devices',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=200&fit=crop'
    },
    {
      id: 'clothing',
      name: 'Ropa',
      icon: 'checkroom',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop'
    },
    {
      id: 'home',
      name: 'Hogar',
      icon: 'home',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop'
    },
    {
      id: 'sports',
      name: 'Deportes',
      icon: 'sports_soccer',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop'
    }
  ];

  getAllProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProductById(id: number): Observable<Product | undefined> {
    const product = this.products.find(p => p.id === id);
    return of(product);
  }

  getProductsByCategory(categoryId: string): Observable<Product[]> {
    const filteredProducts = this.products.filter(p => p.category === categoryId);
    return of(filteredProducts);
  }

  getFeaturedProducts(): Observable<Product[]> {
    const featured = this.products.slice(0, 4);
    return of(featured);
  }

  getCategories(): Observable<Category[]> {
    return of(this.categories);
  }

  searchProducts(query: string): Observable<Product[]> {
    const filtered = this.products.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    );
    return of(filtered);
  }
}
