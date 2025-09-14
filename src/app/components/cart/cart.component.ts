import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  total: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterModule, MaterialModule, CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  private router = inject(Router);
  private cartService = inject(CartService);

  protected cartItems = this.cartService.items;
  protected cartSummary = this.cartService.getCartSummary();

  protected get subtotal(): number {
    return this.cartSummary.subtotal;
  }

  protected get tax(): number {
    return this.cartSummary.tax;
  }

  protected get shipping(): number {
    return this.cartSummary.shipping;
  }

  protected get total(): number {
    return this.cartSummary.total;
  }

  protected updateQuantity(item: any, change: number) {
    if (change > 0) {
      this.cartService.addToCart(item.product);
    } else {
      this.cartService.removeFromCart(item.product.id);
    }
  }

  protected removeItem(itemId: number) {
    this.cartService.removeFromCart(itemId);
  }

  protected clearCart() {
    this.cartService.clearCart();
  }

  protected proceedToCheckout() {
    if (this.cartItems().length === 0) {
      return;
    }
    this.router.navigate(['/checkout']);
  }
}
