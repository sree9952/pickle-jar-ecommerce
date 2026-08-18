import { Routes } from '@angular/router';
import { adminAuthGuard } from './core/guards/admin-auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/product-list.component').then(m => m.ProductListComponent),
  },
  {
    path: 'products/:slug',
    loadComponent: () => import('./features/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent),
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent),
  },
  {
    path: 'order-success/:orderNumber',
    loadComponent: () => import('./features/order-success/order-success.component').then(m => m.OrderSuccessComponent),
  },
  {
    path: 'order-tracking',
    loadComponent: () => import('./features/order-tracking/order-tracking.component').then(m => m.OrderTrackingComponent),
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./features/admin/login/admin-login.component').then(m => m.AdminLoginComponent),
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [adminAuthGuard],
  },
  { path: '**', redirectTo: '' },
];
