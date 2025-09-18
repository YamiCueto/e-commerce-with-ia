# 📋 Instrucciones de Desarrollo - E-commerce Angular

## 🎯 Objetivo del Proyecto

Desarrollar una aplicación de e-commerce moderna con Angular, enfocada en:
- **Mobile-First Design**: Experiencia móvil excepcional
- **Accesibilidad (A11y)**: Cumplimiento WCAG 2.1 AA
- **Performance**: Carga rápida y rendimiento optimizado
- **UX/UI**: Interfaz intuitiva y atractiva
- **Clean Code**: Código limpio, mantenible y escalable

## 🏗️ Arquitectura del Proyecto

```
src/
├── app/
│   ├── components/          # Componentes reutilizables
│   ├── pages/              # Páginas principales
│   ├── services/           # Servicios y lógica de negocio
│   ├── models/             # Interfaces y tipos
│   ├── shared/             # Módulos y utilidades compartidas
│   └── guards/             # Guards de navegación
├── assets/                 # Recursos estáticos
└── styles/                 # Estilos globales y temas
```

## 📐 Convenciones de Desarrollo

### 🖼️ Elementos HTML - Accesibilidad

#### **Imágenes (`<img>`)**
```html
<!-- ✅ CORRECTO -->
<img 
  [src]="product.image" 
  [alt]="product.name || 'Imagen de producto'" 
  [title]="product.name || 'Producto'"
  loading="lazy">

<!-- ❌ INCORRECTO -->
<img [src]="product.image">
<img [src]="product.image" alt="">
```

**Reglas obligatorias:**
- **SIEMPRE** incluir `alt` con descripción significativa
- **SIEMPRE** incluir `title` para información adicional
- Usar `loading="lazy"` para optimización
- Proporcionar fallbacks para valores nulos

#### **Formularios (`<input>`, `<textarea>`, `<select>`)**
```html
<!-- ✅ CORRECTO -->
<mat-form-field appearance="outline">
  <mat-label>Nombre completo</mat-label>
  <input 
    matInput 
    type="text"
    id="fullName"
    name="fullName"
    placeholder="Ingresa tu nombre completo"
    [attr.aria-describedby]="fullName.invalid ? 'fullName-error' : null"
    autocomplete="name"
    required
    #fullName="ngModel">
  <mat-error id="fullName-error">
    El nombre es requerido
  </mat-error>
</mat-form-field>

<!-- ❌ INCORRECTO -->
<input type="text" placeholder="Nombre">
```

**Reglas obligatorias:**
- **SIEMPRE** usar `<label>` o `mat-label` asociado
- **SIEMPRE** incluir `id` y `name` únicos
- **SIEMPRE** usar `placeholder` descriptivo
- **SIEMPRE** incluir `autocomplete` cuando aplique
- **SIEMPRE** usar `aria-describedby` para errores
- **SIEMPRE** `font-size: 16px` mínimo (evita zoom en iOS)

#### **Botones (`<button>`)**
```html
<!-- ✅ CORRECTO -->
<button 
  mat-raised-button 
  color="primary"
  type="submit"
  [disabled]="form.invalid"
  [attr.aria-label]="'Agregar ' + product.name + ' al carrito'"
  class="add-to-cart-btn">
  <mat-icon aria-hidden="true">add_shopping_cart</mat-icon>
  Agregar al carrito
</button>

<!-- ❌ INCORRECTO -->
<button>Comprar</button>
<div (click)="buy()">Comprar</div>
```

**Reglas obligatorias:**
- **SIEMPRE** usar `<button>` (no `<div>` clickeable)
- **SIEMPRE** incluir `type` apropiado
- **SIEMPRE** usar `aria-label` para botones con íconos
- **SIEMPRE** mínimo 48px de área táctil
- **SIEMPRE** estados de `disabled` cuando aplique

#### **Enlaces (`<a>`)**
```html
<!-- ✅ CORRECTO -->
<a 
  routerLink="/products/{{product.id}}"
  [attr.aria-label]="'Ver detalles de ' + product.name"
  class="product-link">
  Ver producto
</a>

<!-- Para enlaces externos -->
<a 
  href="https://external-site.com"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Abrir sitio externo (nueva pestaña)">
  Sitio externo
</a>

<!-- ❌ INCORRECTO -->
<a routerLink="/product">Producto</a>
<span (click)="navigate()">Ver más</span>
```

### 🎨 Estilos y CSS

#### **Mobile-First Approach**
```scss
// ✅ CORRECTO - Mobile primero
.product-grid {
  // Móvil (base)
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 1rem;
  
  // Tablet y superior
  @include respond-to('md') {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    padding: 2rem;
  }
  
  // Desktop
  @include respond-to('lg') {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}

// ❌ INCORRECTO - Desktop primero
.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}
```

#### **Naming Convention - BEM**
```scss
// ✅ CORRECTO - BEM Methodology
.product-card {              // Block
  &__image {                // Element
    width: 100%;
    aspect-ratio: 1/1;
    
    &--placeholder {        // Modifier
      background-color: #f0f0f0;
    }
  }
  
  &__title {
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  &--featured {             // Modifier
    border: 2px solid $primary-color;
  }
}

// ❌ INCORRECTO
.productCard .image {}
.product_title {}
.featuredProduct {}
```

### 🔧 TypeScript - Clean Code

#### **Interfaces y Tipos**
```typescript
// ✅ CORRECTO
export interface Product {
  readonly id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: ProductCategory;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  readonly product: Product;
  quantity: number;
  readonly total: number;
}

export type ProductCategory = 
  | 'electronics' 
  | 'clothing' 
  | 'books' 
  | 'home';

// ❌ INCORRECTO
export interface Product {
  id: any;
  name: any;
  price: any;
  // ... otros campos sin tipos específicos
}
```

#### **Servicios - Single Responsibility**
```typescript
// ✅ CORRECTO
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _cartItems = signal<CartItem[]>([]);
  
  // Getter público
  readonly cartItems = this._cartItems.asReadonly();
  
  // Métodos públicos con nombres descriptivos
  addItem(product: Product, quantity: number = 1): void {
    if (!this.isValidProduct(product)) {
      throw new Error('Invalid product');
    }
    
    const existingItem = this.findItemByProductId(product.id);
    
    if (existingItem) {
      this.updateItemQuantity(existingItem, quantity);
    } else {
      this.createNewItem(product, quantity);
    }
  }
  
  // Métodos privados para lógica interna
  private isValidProduct(product: Product): boolean {
    return product && product.id && product.price > 0;
  }
  
  private findItemByProductId(id: string): CartItem | undefined {
    return this._cartItems().find(item => item.product.id === id);
  }
}

// ❌ INCORRECTO
@Injectable()
export class CartService {
  cartItems: any[] = [];
  
  add(p: any): void {
    // Lógica compleja sin validaciones
    this.cartItems.push(p);
  }
}
```

#### **Componentes - KISS Principle**
```typescript
// ✅ CORRECTO - Simple y enfocado
@Component({
  selector: 'app-product-card',
  template: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Output() addToCart = new EventEmitter<Product>();
  @Output() toggleFavorite = new EventEmitter<Product>();
  
  protected readonly DEFAULT_IMAGE = '/assets/images/product-placeholder.jpg';
  
  onAddToCart(): void {
    if (this.product.inStock) {
      this.addToCart.emit(this.product);
    }
  }
  
  onToggleFavorite(): void {
    this.toggleFavorite.emit(this.product);
  }
  
  getImageSrc(): string {
    return this.product.image || this.DEFAULT_IMAGE;
  }
  
  getImageAlt(): string {
    return this.product.name || 'Imagen de producto';
  }
}

// ❌ INCORRECTO - Demasiadas responsabilidades
@Component({...})
export class ProductCardComponent {
  @Input() product: any;
  
  // Maneja carrito, favoritos, navegación, etc.
  onAction(type: string): void {
    if (type === 'cart') {
      // lógica del carrito
    } else if (type === 'fav') {
      // lógica de favoritos
    } else if (type === 'nav') {
      // lógica de navegación
    }
  }
}
```

## 🧪 Testing - Buenas Prácticas

### **Unit Tests**
```typescript
// ✅ CORRECTO - AAA Pattern
describe('CartService', () => {
  let service: CartService;
  let mockProduct: Product;
  
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
    
    mockProduct = {
      id: '1',
      name: 'Test Product',
      price: 29.99,
      // ... otros campos requeridos
    };
  });
  
  describe('addItem', () => {
    it('should add new item when product not in cart', () => {
      // Arrange
      const quantity = 2;
      
      // Act
      service.addItem(mockProduct, quantity);
      
      // Assert
      expect(service.cartItems()).toHaveLength(1);
      expect(service.cartItems()[0].product.id).toBe(mockProduct.id);
      expect(service.cartItems()[0].quantity).toBe(quantity);
    });
    
    it('should throw error when product is invalid', () => {
      // Arrange
      const invalidProduct = { ...mockProduct, id: '' };
      
      // Act & Assert
      expect(() => service.addItem(invalidProduct))
        .toThrow('Invalid product');
    });
  });
});
```

## 🎯 Principios de Desarrollo

### **KISS (Keep It Simple, Stupid)**
- Funciones pequeñas con una sola responsabilidad
- Nombres descriptivos y claros
- Evitar over-engineering
- Código que se explique por sí mismo

### **DRY (Don't Repeat Yourself)**
- Usar servicios para lógica compartida
- Crear componentes reutilizables
- Utilizar mixins y variables SCSS
- Extraer constantes y configuraciones

### **SOLID Principles**
- **S**ingle Responsibility: Una clase, una responsabilidad
- **O**pen/Closed: Abierto para extensión, cerrado para modificación
- **L**iskov Substitution: Subtipos deben ser reemplazables
- **I**nterface Segregation: Interfaces específicas mejor que generales
- **D**ependency Inversion: Depender de abstracciones, no concreciones

### **Performance Best Practices**
- Usar `OnPush` change detection cuando sea posible
- Lazy loading para rutas
- Track by functions en *ngFor
- Unsubscribe de observables en OnDestroy
- Optimización de imágenes (WebP, lazy loading)

## 📋 Checklist de Review

### **HTML/Template**
- [ ] Todos los `<img>` tienen `alt` y `title`
- [ ] Todos los formularios tienen labels apropiados
- [ ] Botones tienen `aria-label` cuando necesario
- [ ] Enlaces externos tienen `rel="noopener noreferrer"`
- [ ] Touch targets mínimo 48px
- [ ] Semántica HTML correcta

### **CSS/SCSS**
- [ ] Mobile-first approach
- [ ] BEM naming convention
- [ ] Variables y mixins utilizados
- [ ] No magic numbers
- [ ] Prefijos de navegador cuando necesario

### **TypeScript**
- [ ] Tipos explícitos (no `any`)
- [ ] Interfaces definidas
- [ ] Funciones puras cuando posible
- [ ] Error handling apropiado
- [ ] Código documentado con JSDoc

### **Performance**
- [ ] OnPush change detection
- [ ] Lazy loading implementado
- [ ] Imágenes optimizadas
- [ ] Bundle size analizado
- [ ] Lighthouse score > 90

### **Testing**
- [ ] Unit tests escritos
- [ ] Coverage > 80%
- [ ] E2E tests para flujos críticos
- [ ] Tests de accesibilidad

## 🔧 Herramientas y Configuración

### **Linting**
```json
{
  "extends": ["@angular-eslint/recommended"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

### **Prettier**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### **Husky Pre-commit Hooks**
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test"
    }
  },
  "lint-staged": {
    "*.{ts,js,html}": ["eslint --fix", "prettier --write"]
  }
}
```

## 📚 Resources

- [Angular Style Guide](https://angular.io/guide/styleguide)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Mobile-First Design Guide](./src/MOBILE-FIRST-README.md)
- [Clean Code Principles](https://clean-code-developer.com/)
- [BEM Methodology](http://getbem.com/)

---

**Recuerda**: El código se escribe una vez pero se lee muchas veces. Hazlo claro, mantenible y accesible para todos.

*Creado con ❤️ para el equipo de desarrollo*
