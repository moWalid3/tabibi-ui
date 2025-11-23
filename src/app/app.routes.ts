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
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'doctors',
        loadComponent: () => import('./pages/doctors/doctors').then((m) => m.Doctors),
      },
      {
        path: 'doctors/:id',
        loadComponent: () => import('./pages/doctors/doctor-details/doctor-details').then((m) => m.DoctorDetails),
      },
      {
        path: 'patients',
        loadComponent: () => import('./pages/patients/patients').then((m) => m.Patients),
      },
      {
        path: 'departments',
        loadComponent: () => import('./pages/departments/departments').then((m) => m.Departments),
      },
      {
        path: 'departments/new',
        loadComponent: () => import('./pages/departments/department-form/department-form').then((m) => m.DepartmentForm),
      },
      {
        path: 'departments/:id',
        loadComponent: () => import('./pages/departments/department-details/department-details').then((m) => m.DepartmentDetails),
      },
      {
        path: 'departments/:id/edit',
        loadComponent: () => import('./pages/departments/department-form/department-form').then((m) => m.DepartmentForm),
      },
      {
        path: 'cities',
        loadComponent: () => import('./pages/cities/cities').then((m) => m.Cities),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login').then((m) => m.Login),
    canActivate: [authEnterGuard],
  },
  {
    path: '**',
    loadComponent: () => import('./pages/notfound/notfound').then(m => m.Notfound)
  }
];
