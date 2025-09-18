import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { NotificationService } from './notification.service';
import { Product } from './product.service';

// Mock NotificationService
const mockNotificationService = {
  showCartSuccess: jest.fn(),
  showCartUpdated: jest.fn(),
  showCartRemoved: jest.fn(),
  showCartCleared: jest.fn(),
  showWarning: jest.fn(),
  showError: jest.fn()
};

describe('CartService', () => {
  let service: CartService;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    price: 29.99,
    image: '/assets/test-image.jpg',
    images: ['/assets/test-image.jpg'],
    category: 'electronics',
    rating: 4.5,
    reviews: 100,
    features: ['Feature 1', 'Feature 2'],
    specifications: { 'Color': 'Black', 'Size': 'Medium' },
    inStock: true,
    stockCount: 10
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: NotificationService, useValue: mockNotificationService }
      ]
    });
    service = TestBed.inject(CartService);
  });

  afterEach(() => {
    service.clearCart();
    jest.clearAllMocks();
  });

  describe('Component Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with empty cart', () => {
      expect(service.items()).toEqual([]);
      expect(service.itemCount()).toBe(0);
      expect(service.subtotal()).toBe(0);
      expect(service.tax()).toBe(0);
      expect(service.shipping()).toBe(9.99);
      expect(service.total()).toBe(9.99);
    });
  });

  describe('addToCart', () => {
    it('should add new item when product not in cart', () => {
      // Act
      service.addToCart(mockProduct, 2);

      // Assert
      const cartItems = service.items();
      expect(cartItems).toHaveLength(1);
      expect(cartItems[0].product.id).toBe(mockProduct.id);
      expect(cartItems[0].quantity).toBe(2);
      expect(cartItems[0].total).toBe(59.98);
      expect(mockNotificationService.showCartSuccess).toHaveBeenCalledWith(mockProduct.name, 2);
    });

    it('should update quantity when product already in cart', () => {
      // Arrange
      service.addToCart(mockProduct, 1);
      jest.clearAllMocks();

      // Act
      service.addToCart(mockProduct, 2);

      // Assert
      const cartItems = service.items();
      expect(cartItems).toHaveLength(1);
      expect(cartItems[0].quantity).toBe(3);
      expect(cartItems[0].total).toBe(89.97);
      expect(mockNotificationService.showCartUpdated).toHaveBeenCalledWith(mockProduct.name, 3);
    });

    it('should handle quantity of 1 when not specified', () => {
      // Act
      service.addToCart(mockProduct);

      // Assert
      const cartItems = service.items();
      expect(cartItems).toHaveLength(1);
      expect(cartItems[0].quantity).toBe(1);
      expect(cartItems[0].total).toBe(29.99);
    });

    it('should show warning when quantity exceeds stock', () => {
      // Act
      service.addToCart(mockProduct, 15); // More than stockCount (10)

      // Assert
      expect(service.items()).toHaveLength(0);
      expect(mockNotificationService.showWarning).toHaveBeenCalledWith(
        'Stock limitado',
        expect.stringContaining('Solo tenemos 10 unidades')
      );
    });
  });

  describe('removeFromCart', () => {
    beforeEach(() => {
      service.addToCart(mockProduct, 2);
      jest.clearAllMocks();
    });

    it('should remove item from cart by string id', () => {
      // Act
      service.removeFromCart(mockProduct.id);

      // Assert
      expect(service.items()).toHaveLength(0);
      expect(service.itemCount()).toBe(0);
    });

    it('should remove item from cart by number id', () => {
      // Act
      service.removeFromCart(1); // Assuming service accepts number

      // Assert
      expect(service.items()).toHaveLength(0);
      expect(service.itemCount()).toBe(0);
    });
  });

  describe('updateQuantity', () => {
    beforeEach(() => {
      service.addToCart(mockProduct, 2);
      jest.clearAllMocks();
    });

    it('should update item quantity', () => {
      // Act
      service.updateQuantity(1, 5); // Assuming service accepts number id

      // Assert
      const cartItems = service.items();
      expect(cartItems[0].quantity).toBe(5);
      expect(cartItems[0].total).toBe(149.95);
    });

    it('should remove item when quantity is 0 or negative', () => {
      // Act
      service.updateQuantity(1, 0);

      // Assert
      expect(service.items()).toHaveLength(0);
    });

    it('should show warning when quantity exceeds stock', () => {
      // Act
      service.updateQuantity(1, 15); // More than stockCount (10)

      // Assert
      const cartItems = service.items();
      expect(cartItems[0].quantity).toBe(2); // Should remain unchanged
      expect(mockNotificationService.showWarning).toHaveBeenCalled();
    });
  });

  describe('clearCart', () => {
    beforeEach(() => {
      service.addToCart(mockProduct, 2);
    });

    it('should clear all items from cart', () => {
      // Act
      service.clearCart();

      // Assert
      expect(service.items()).toHaveLength(0);
      expect(service.itemCount()).toBe(0);
      expect(service.subtotal()).toBe(0);
      expect(service.total()).toBe(9.99); // shipping cost remains
    });
  });

  describe('Computed Properties', () => {
    beforeEach(() => {
      service.addToCart(mockProduct, 2);
      service.addToCart({
        ...mockProduct,
        id: 2,
        name: 'Product 2',
        price: 19.99
      }, 1);
    });

    it('should calculate item count correctly', () => {
      expect(service.itemCount()).toBe(3); // 2 + 1
    });

    it('should calculate subtotal correctly', () => {
      expect(service.subtotal()).toBe(79.97); // (29.99 * 2) + (19.99 * 1)
    });

    it('should calculate tax correctly (15%)', () => {
      expect(service.tax()).toBeCloseTo(11.9955, 2); // 79.97 * 0.15
    });

    it('should calculate shipping correctly', () => {
      expect(service.shipping()).toBe(9.99); // Shipping for orders under $100
    });

    it('should calculate total correctly', () => {
      const expectedTotal = 79.97 + 11.9955 + 9.99;
      expect(service.total()).toBeCloseTo(expectedTotal, 2);
    });

    it('should provide free shipping when subtotal is over $100', () => {
      // Arrange - clear cart and add high-value items
      service.clearCart();
      service.addToCart({
        ...mockProduct,
        id: 3,
        price: 60.00
      }, 2); // Total: $120

      // Assert
      expect(service.subtotal()).toBe(120);
      expect(service.shipping()).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle products with zero price', () => {
      const freeProduct = { ...mockProduct, price: 0 };
      service.addToCart(freeProduct, 1);

      const cartItems = service.items();
      expect(cartItems[0].total).toBe(0);
    });

    it('should handle very large quantities within stock limit', () => {
      const largeStockProduct = { ...mockProduct, stockCount: 999999 };
      service.addToCart(largeStockProduct, 500000);

      const cartItems = service.items();
      expect(cartItems[0].quantity).toBe(500000);
      expect(cartItems[0].total).toBe(29.99 * 500000);
    });
  });
});
