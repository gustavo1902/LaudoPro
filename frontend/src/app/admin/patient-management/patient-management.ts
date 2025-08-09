import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api';

@Component({
  selector: 'app-patient-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-management.html',
})
export class PatientManagement implements OnInit {
  patients: any[] = [];
  selectedPatient: any = null;
  isEditing = false;
  newPatient: any = {};
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.fetchPatients();
  }

  fetchPatients(): void {
    this.apiService.getPatients().subscribe({
      next: (data) => this.patients = data,
      error: (err) => this.errorMessage = 'Não foi possível carregar os pacientes.'
    });
  }

  editPatient(patient: any): void {
    this.selectedPatient = { ...patient };
    this.isEditing = true;
  }

  deletePatient(id: number): void {
    if (confirm('Tem certeza que deseja excluir este paciente?')) {
      this.apiService.deletePatient(id).subscribe({
        next: () => {
          this.successMessage = 'Paciente excluído com sucesso!';
          this.fetchPatients();
        },
        error: (err) => this.errorMessage = 'Erro ao excluir paciente.'
      });
    }
  }

  savePatient(): void {
    if (this.isEditing) {
      this.apiService.updatePatient(this.selectedPatient.id, this.selectedPatient).subscribe({
        next: () => {
          this.successMessage = 'Paciente atualizado com sucesso!';
          this.fetchPatients();
          this.cancelEdit();
        },
        error: (err) => this.errorMessage = 'Erro ao atualizar paciente.'
      });
    } else {
      this.apiService.createPatient(this.newPatient).subscribe({
        next: () => {
          this.successMessage = 'Paciente cadastrado com sucesso!';
          this.fetchPatients();
          this.newPatient = {};
        },
        error: (err) => this.errorMessage = 'Erro ao cadastrar paciente.'
      });
    }
  }

  cancelEdit(): void {
    this.selectedPatient = null;
    this.isEditing = false;
  }
}