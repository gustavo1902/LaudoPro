import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login'; 

// Rotas de dashboard e 404
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { PatientDashboard } from './patient/dashboard/dashboard';
import { PageNotFound } from './shared/page-not-found/page-not-found';

import { AuthGuard } from './core/auth-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin/dashboard',
    component: AdminDashboard,
    canActivate: [AuthGuard],
    data: { role: 'ROLE_ADMIN' }
  },
  {
    path: 'patient/dashboard',
    component: PatientDashboard,
    canActivate: [AuthGuard],
    data: { role: 'ROLE_PACIENTE' }
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFound }
];