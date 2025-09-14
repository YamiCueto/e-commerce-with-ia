import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product, Category } from '../../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterModule, MaterialModule, CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  protected allProducts: Product[] = [];
  protected filteredProducts: Product[] = [];
  protected categories: Category[] = [];
  protected searchTerm = '';
  protected selectedCategory = 'all';
  protected sortBy = 'name-asc';
  protected loading = true;

  protected sortOptions = [
    { value: 'name-asc', label: 'Nombre A-Z' },
    { value: 'name-desc', label: 'Nombre Z-A' },
    { value: 'price-asc', label: 'Precio: Menor a Mayor' },
    { value: 'price-desc', label: 'Precio: Mayor a Menor' },
    { value: 'rating', label: 'Mejor Valorados' }
  ];

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();

    // Verificar si hay una categoría especificada en la ruta
    this.route.params.subscribe(params => {
      if (params['category']) {
        this.selectedCategory = params['category'];
        this.filterProducts();
      }
    });
  }

  private loadCategories() {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = [
          { id: 'all', name: 'Todas las categorías', icon: 'apps', image: '' },
          ...categories
        ];
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  private loadProducts() {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.allProducts = products;
        this.filterProducts();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  protected onSearchChange() {
    this.filterProducts();
  }

  protected onCategoryChange() {
    this.filterProducts();
  }

  protected onSortChange() {
    this.filterProducts();
  }

  private filterProducts() {
    this.productService.getFilteredProducts(
      this.selectedCategory,
      this.searchTerm,
      this.sortBy
    ).subscribe({
      next: (products) => {
        this.filteredProducts = products;
      },
      error: (error) => {
        console.error('Error filtering products:', error);
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
