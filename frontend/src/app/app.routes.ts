import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login'; 

// Rotas de dashboard e 404
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { PatientDashboardComponent } from './patient/dashboard/dashboard.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';

import { AuthGuard } from './core/auth.guard'; // Caminho para o AuthGuard

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'ROLE_ADMIN' }
  },
  {
    path: 'patient/dashboard',
    component: PatientDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'ROLE_PACIENTE' }
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];