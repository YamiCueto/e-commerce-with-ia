import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { CommonModule } from '@angular/common';

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
  protected cartItems: CartItem[] = [
    {
      id: 1,
      name: 'Smartphone Pro Max',
      price: 999.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&h=150&fit=crop',
      total: 999.99
    },
    {
      id: 3,
      name: 'Auriculares Wireless',
      price: 199.99,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop',
      total: 399.98
    }
  ];

  protected get subtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.total, 0);
  }

  protected get tax(): number {
    return this.subtotal * 0.15; // 15% tax
  }

  protected get shipping(): number {
    return this.subtotal > 100 ? 0 : 9.99;
  }

  protected get total(): number {
    return this.subtotal + this.tax + this.shipping;
  }

  protected updateQuantity(item: CartItem, change: number) {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      item.quantity = newQuantity;
      item.total = item.price * item.quantity;
    }
  }

  protected removeItem(itemId: number) {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
  }

  protected clearCart() {
    this.cartItems = [];
  }

  protected proceedToCheckout() {
    // TODO: Implement checkout logic
    console.log('Proceeding to checkout...', {
      items: this.cartItems,
      total: this.total
    });
  }
}
