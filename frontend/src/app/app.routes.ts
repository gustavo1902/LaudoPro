import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { RegistrationComponent } from './auth/registration/registration.component';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { PatientDashboard } from './patient/dashboard/dashboard';
import { PageNotFound } from './shared/page-not-found/page-not-found';
import { AuthGuard } from './core/auth-guard';
import { PatientManagement } from './admin/patient-management/patient-management';
import { ExamManagement } from './admin/exam-management/exam-management';
import { MyExams} from './patient/my-exams/my-exams';
import { PatientProfile } from './patient/patient-profile/patient-profile';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistrationComponent },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' },
    children: [
      { path: 'dashboard', component: AdminDashboard },
      { path: 'pacientes', component: PatientManagement },
      { path: 'exames', component: ExamManagement },
    ]
  },
  {
    path: 'paciente',
    canActivate: [AuthGuard],
    data: { role: 'PACIENTE' },
    children: [
      { path: 'dashboard', component: PatientDashboard },
      { path: 'meus-exames', component: MyExams },
      { path: 'perfil', component: PatientProfile },
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFound }
];