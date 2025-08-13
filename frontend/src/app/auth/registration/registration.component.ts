import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink]
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Redireciona se o usuário já estiver logado
    if (this.authService.isAuthenticated()) {
      const userRole = this.authService.getUserRole();
      if (userRole === 'ADMIN') {
        this.router.navigate(['/admin/dashboard']);
      } else if (userRole === 'PACIENTE') {
        this.router.navigate(['/paciente/dashboard']);
      }
      return;
    }

    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.registrationForm.valid) {
      const { name, email, password } = this.registrationForm.value;
      
      this.authService.register(name, email, password, 'PACIENTE')
        .subscribe({
          next: () => {
            this.successMessage = 'Registro concluído com sucesso! Você pode fazer login agora.';
            this.router.navigate(['/login']);
          },
          error: (error) => {
            console.error('Registration failed:', error);
            // Mensagem de erro mais amigável
            this.errorMessage = 'Erro ao se registrar. Verifique os dados e tente novamente.';
            if (error.status === 409) {
                this.errorMessage = 'Este email já está em uso.';
            }
          }
        });
    } else {
      this.errorMessage = 'Por favor, preencha todos os campos corretamente.';
    }
  }
}
