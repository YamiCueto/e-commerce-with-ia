import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterModule, MaterialModule, CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  protected products = [
    {
      id: 1,
      name: 'Smartphone Pro Max',
      price: 999.99,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop',
      rating: 4.5,
      reviews: 128,
      description: 'El smartphone más avanzado con tecnología de punta'
    },
    {
      id: 2,
      name: 'Laptop Gaming',
      price: 1299.99,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop',
      rating: 4.8,
      reviews: 89,
      description: 'Laptop para gaming de alto rendimiento'
    },
    {
      id: 3,
      name: 'Auriculares Wireless',
      price: 199.99,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
      rating: 4.3,
      reviews: 256,
      description: 'Auriculares inalámbricos con cancelación de ruido'
    },
    {
      id: 4,
      name: 'Smartwatch',
      price: 399.99,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
      rating: 4.6,
      reviews: 167,
      description: 'Reloj inteligente con monitor de salud'
    },
    {
      id: 5,
      name: 'Tablet Pro',
      price: 799.99,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=300&h=300&fit=crop',
      rating: 4.4,
      reviews: 92,
      description: 'Tablet profesional para trabajo y entretenimiento'
    },
    {
      id: 6,
      name: 'Cámara Mirrorless',
      price: 1599.99,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=300&fit=crop',
      rating: 4.7,
      reviews: 143,
      description: 'Cámara profesional sin espejo con lentes intercambiables'
    }
  ];

  protected filteredProducts = this.products;
  protected searchTerm = '';
  protected selectedCategory = 'all';
  protected sortBy = 'name';

  protected categories = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'electronics', label: 'Electrónicos' },
    { value: 'clothing', label: 'Ropa' },
    { value: 'home', label: 'Hogar' },
    { value: 'sports', label: 'Deportes' }
  ];

  protected sortOptions = [
    { value: 'name', label: 'Nombre' },
    { value: 'price-low', label: 'Precio: Menor a Mayor' },
    { value: 'price-high', label: 'Precio: Mayor a Menor' },
    { value: 'rating', label: 'Mejor valorados' }
  ];

  ngOnInit() {
    this.filterProducts();
  }

  protected onSearchChange() {
    this.filterProducts();
  }

  protected onCategoryChange() {
    this.filterProducts();
  }

  protected onSortChange() {
    this.sortProducts();
  }

  private filterProducts() {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.selectedCategory === 'all' || product.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
    this.sortProducts();
  }

  private sortProducts() {
    this.filteredProducts.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
  }

  protected getStars(rating: number): string[] {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars: string[] = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push('star');
    }

    if (hasHalfStar) {
      stars.push('star_half');
    }

    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push('star_border');
    }

    return stars;
  }
}
