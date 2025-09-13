import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { CommonModule } from '@angular/common';

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

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterModule, MaterialModule, CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  protected product: Product | null = null;
  protected selectedImage = 0;
  protected quantity = 1;

  // Mock data - in real app, this would come from a service
  private mockProducts: Product[] = [
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
      description: 'El smartphone más avanzado con tecnología de punta, diseño elegante y rendimiento excepcional. Perfecto para usuarios que buscan la mejor experiencia móvil.',
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
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const productId = parseInt(params['id']);
      this.loadProduct(productId);
    });
  }

  private loadProduct(id: number) {
    // In real app, this would be a service call
    this.product = this.mockProducts.find(p => p.id === id) || null;
  }

  protected selectImage(index: number) {
    this.selectedImage = index;
  }

  protected updateQuantity(change: number) {
    const newQuantity = this.quantity + change;
    if (newQuantity >= 1 && this.product && newQuantity <= this.product.stockCount) {
      this.quantity = newQuantity;
    }
  }

  protected addToCart() {
    if (this.product) {
      // TODO: Implement cart service
      console.log('Adding to cart:', {
        product: this.product,
        quantity: this.quantity
      });
    }
  }

  protected buyNow() {
    if (this.product) {
      // TODO: Implement buy now logic
      console.log('Buy now:', {
        product: this.product,
        quantity: this.quantity
      });
    }
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
