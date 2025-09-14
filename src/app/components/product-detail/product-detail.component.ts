import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterModule, MaterialModule, CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  protected product: Product | null = null;
  protected selectedImage = 0;
  protected quantity = 1;
  protected loading = true;
  protected notFound = false;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.loadProduct(productId);
    });
  }

  private loadProduct(id: number) {
    this.loading = true;
    this.notFound = false;

    this.productService.getProductById(id).subscribe({
      next: (product) => {
        if (product) {
          this.product = product;
          this.selectedImage = 0;
        } else {
          this.notFound = true;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.notFound = true;
        this.loading = false;
      }
    });
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
      this.cartService.addToCart(this.product, this.quantity);
      // Resetear cantidad después de agregar al carrito
      this.quantity = 1;
    }
  }

  protected buyNow() {
    if (this.product) {
      // Agregar al carrito y navegar al checkout
      this.cartService.addToCart(this.product, this.quantity);
      // TODO: Implement navigation to checkout
      console.log('Navegando al checkout...');
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

  protected getDiscountPercentage(): number {
    if (this.product && this.product.originalPrice && this.product.originalPrice > this.product.price) {
      return Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100);
    }
    return 0;
  }
}
