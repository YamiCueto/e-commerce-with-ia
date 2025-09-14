import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(c => c.HomeComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./components/products/products.component').then(c => c.ProductsComponent)
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./components/product-detail/product-detail.component').then(c => c.ProductDetailComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./components/cart/cart.component').then(c => c.CartComponent)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./components/checkout/checkout.component').then(c => c.CheckoutComponent)
  },
  {
    path: 'checkout/success',
    loadComponent: () => import('./components/checkout-success/checkout-success.component').then(c => c.CheckoutSuccessComponent)
  },
  {
    path: 'category/:id',
    loadComponent: () => import('./components/products/products.component').then(c => c.ProductsComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
