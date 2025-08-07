import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-profile.html',
})
export class PatientProfileComponent implements OnInit {
  patientProfile: any = {};
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getPatientProfile().subscribe({
      next: (data) => this.patientProfile = data,
      error: (err) => this.errorMessage = 'Não foi possível carregar seu perfil.'
    });
  }

  updateProfile(): void {
    this.apiService.updatePatientProfile(this.patientProfile).subscribe({
      next: () => this.successMessage = 'Perfil atualizado com sucesso!',
      error: (err) => this.errorMessage = 'Erro ao atualizar o perfil.'
    });
  }
}