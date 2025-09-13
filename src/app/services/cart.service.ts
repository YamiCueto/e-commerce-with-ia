import { Injectable, signal, computed } from '@angular/core';
import { Product } from './product.service';

export interface CartItem {
  product: Product;
  quantity: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);

  // Computed signals for reactive cart data
  items = this.cartItems.asReadonly();
  itemCount = computed(() => this.cartItems().reduce((sum, item) => sum + item.quantity, 0));
  subtotal = computed(() => this.cartItems().reduce((sum, item) => sum + item.total, 0));
  tax = computed(() => this.subtotal() * 0.15); // 15% tax
  shipping = computed(() => this.subtotal() > 100 ? 0 : 9.99);
  total = computed(() => this.subtotal() + this.tax() + this.shipping());

  addToCart(product: Product, quantity: number = 1): void {
    const existingItemIndex = this.cartItems().findIndex(item => item.product.id === product.id);

    if (existingItemIndex >= 0) {
      // Update existing item
      const currentItems = [...this.cartItems()];
      const existingItem = currentItems[existingItemIndex];
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity <= product.stockCount) {
        currentItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          total: product.price * newQuantity
        };
        this.cartItems.set(currentItems);
      }
    } else {
      // Add new item
      if (quantity <= product.stockCount) {
        const newItem: CartItem = {
          product,
          quantity,
          total: product.price * quantity
        };
        this.cartItems.set([...this.cartItems(), newItem]);
      }
    }
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = [...this.cartItems()];
    const itemIndex = currentItems.findIndex(item => item.product.id === productId);

    if (itemIndex >= 0) {
      const item = currentItems[itemIndex];
      if (quantity <= item.product.stockCount) {
        currentItems[itemIndex] = {
          ...item,
          quantity,
          total: item.product.price * quantity
        };
        this.cartItems.set(currentItems);
      }
    }
  }

  removeFromCart(productId: number): void {
    this.cartItems.set(this.cartItems().filter(item => item.product.id !== productId));
  }

  clearCart(): void {
    this.cartItems.set([]);
  }

  getCartItem(productId: number): CartItem | undefined {
    return this.cartItems().find(item => item.product.id === productId);
  }

  isInCart(productId: number): boolean {
    return this.cartItems().some(item => item.product.id === productId);
  }

  // Load from localStorage (can be called on app initialization)
  loadFromStorage(): void {
    try {
      const saved = localStorage.getItem('cart');
      if (saved) {
        const parsedItems = JSON.parse(saved) as CartItem[];
        this.cartItems.set(parsedItems);
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
    }
  }

  // Save to localStorage (can be called on cart changes)
  saveToStorage(): void {
    try {
      localStorage.setItem('cart', JSON.stringify(this.cartItems()));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }
}
