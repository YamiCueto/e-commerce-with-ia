import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { Product } from './product.service';
import { NotificationService } from './notification.service';

export interface CartItem {
  product: Product;
  quantity: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private notificationService = inject(NotificationService);
  private cartItems = signal<CartItem[]>([]);

  // Computed signals for reactive cart data
  items = this.cartItems.asReadonly();
  itemCount = computed(() => this.cartItems().reduce((sum, item) => sum + item.quantity, 0));
  subtotal = computed(() => this.cartItems().reduce((sum, item) => sum + item.total, 0));
  tax = computed(() => this.subtotal() * 0.15); // 15% tax
  shipping = computed(() => this.subtotal() > 100 ? 0 : 9.99);
  total = computed(() => this.subtotal() + this.tax() + this.shipping());

  constructor() {
    // Auto-save to localStorage whenever cart changes
    effect(() => {
      this.saveToStorage();
    });
  }

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

        // Show notification for update
        this.notificationService.showCartUpdated(product.name, newQuantity);
      } else {
        // Show warning if exceeds stock
        this.notificationService.showWarning(
          'Stock limitado',
          `Solo tenemos ${product.stockCount} unidades de ${product.name} disponibles`
        );
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

        // Show success notification
        this.notificationService.showCartSuccess(product.name, quantity);
      } else {
        // Show warning if exceeds stock
        this.notificationService.showWarning(
          'Stock limitado',
          `Solo tenemos ${product.stockCount} unidades de ${product.name} disponibles`
        );
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

        // Show update notification
        this.notificationService.showCartUpdated(item.product.name, quantity);
      } else {
        // Show warning if exceeds stock
        this.notificationService.showWarning(
          'Stock limitado',
          `Solo tenemos ${item.product.stockCount} unidades disponibles`
        );
      }
    }
  }

  removeFromCart(productId: number): void {
    const itemToRemove = this.cartItems().find(item => item.product.id === productId);
    this.cartItems.set(this.cartItems().filter(item => item.product.id !== productId));

    // Show removal notification
    if (itemToRemove) {
      this.notificationService.showCartRemoved(itemToRemove.product.name);
    }
  }

  clearCart(): void {
    if (this.cartItems().length > 0) {
      this.cartItems.set([]);
      this.notificationService.showCartCleared();
    }
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
      this.notificationService.showError(
        'Error de carga',
        'No se pudo cargar el carrito guardado'
      );
    }
  }

  // Save to localStorage (called automatically via effect)
  private saveToStorage(): void {
    try {
      localStorage.setItem('cart', JSON.stringify(this.cartItems()));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  /**
   * Calculate cart summary for checkout
   */
  getCartSummary() {
    return {
      items: this.items(),
      itemCount: this.itemCount(),
      subtotal: this.subtotal(),
      tax: this.tax(),
      shipping: this.shipping(),
      total: this.total()
    };
  }
}
