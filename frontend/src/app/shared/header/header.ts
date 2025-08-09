import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <header class="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold">LaudoPro</h1>
      <nav *ngIf="authService.isAuthenticated()">
        <ul class="flex space-x-4">
          <ng-container *ngIf="authService.isAdmin()">
            <li><a routerLink="/admin/dashboard" routerLinkActive="font-bold" [routerLinkActiveOptions]="{exact: true}">Dashboard</a></li>
            <li><a routerLink="/admin/pacientes" routerLinkActive="font-bold">Pacientes</a></li>
            <li><a routerLink="/admin/exames" routerLinkActive="font-bold">Exames</a></li>
          </ng-container>
          <ng-container *ngIf="authService.isPatient()">
            <li><a routerLink="/paciente/dashboard" routerLinkActive="font-bold" [routerLinkActiveOptions]="{exact: true}">Dashboard</a></li>
            <li><a routerLink="/paciente/meus-exames" routerLinkActive="font-bold">Meus Exames</a></li>
            <li><a routerLink="/paciente/perfil" routerLinkActive="font-bold">Meu Perfil</a></li>
          </ng-container>
          <li><button (click)="authService.logout()">Sair</button></li>
        </ul>
      </nav>
    </header>
  `,
  styles: [`
    header {
      background-color: #1a202c;
      color: #fff;
    }
    nav a, nav button {
      color: #fff;
      text-decoration: none;
      transition: color 0.2s;
    }
    nav a:hover, nav button:hover {
      color: #a0aec0;
    }
    .font-bold {
      font-weight: 700;
      border-bottom: 2px solid #fff;
    }
  `]
})
export class HeaderComponent {
  constructor(public authService: AuthService) { }
}