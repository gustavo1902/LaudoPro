import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth';
import { HeaderComponent } from '../../shared/header/header';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent]
})
export class LoginComponent {
  email = '';
  senha = '';
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    this.errorMessage = null;
    this.authService.login(this.email, this.senha).subscribe({
      next: (response) => {
        console.log('Login bem-sucedido', response);
        // A lógica de roteamento agora usa o getUserRole para ser mais robusta
        const userRole = this.authService.getUserRole();
        if (userRole === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else if (userRole === 'PACIENTE') {
          this.router.navigate(['/paciente/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        console.error('Erro de login:', error);
        this.errorMessage = 'Erro ao fazer login. Verifique suas credenciais.';
        if (error.error && typeof error.error === 'string') {
          this.errorMessage = error.error;
        } else if (error.status === 401) {
          this.errorMessage = 'Email ou senha inválidos.';
        }
      }
    });
  }
}