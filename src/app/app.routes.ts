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
    path: 'category/:id',
    loadComponent: () => import('./components/products/products.component').then(c => c.ProductsComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
