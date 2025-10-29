import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { authEnterGuard } from './core/guards/auth-enter.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/layouts').then((m) => m.Layouts),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/products/products').then((m) => m.Products),
      },
      {
        path: 'doctors',
        loadComponent: () => import('./pages/doctors/doctors').then((m) => m.Doctors),
      },
      {
        path: 'patients',
        loadComponent: () => import('./pages/patients/patients').then((m) => m.Patients),
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/products/products').then((m) => m.Products),
      },
      {
        path: 'products/add',
        loadComponent: () =>
          import('./pages/products/add-product/add-product').then((m) => m.AddProduct),
      },
      {
        path: 'products/edit/:id',
        loadComponent: () =>
          import('./pages/products/edit-product/edit-product').then((m) => m.EditProduct),
      },
      {
        path: 'products/details/:id',
        loadComponent: () =>
          import('./pages/products/product-details/product-details').then((m) => m.ProductDetails),
      },
      {
        path: 'categories',
        loadComponent: () => import('./pages/categories/categories').then((m) => m.Categories),
      },
      {
        path: 'categories/add',
        loadComponent: () =>
          import('./pages/categories/add-category/add-category').then((m) => m.AddCategory),
      },
      {
        path: 'categories/edit/:id',
        loadComponent: () =>
          import('./pages/categories/edit-category/edit-category').then((m) => m.EditCategory),
      },
    ],
    // canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login').then((m) => m.Login),
    canActivate: [authEnterGuard],
  },
  // {
  //   path: '**',
  //   loadComponent: () => import('./pages/notfound/notfound.component').then(m => m.NotfoundComponent)
  // }
];
