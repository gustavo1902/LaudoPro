import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api';

@Component({
  selector: 'app-exam-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exam-management.html',
})
export class ExamManagementComponent implements OnInit {
  exams: any[] = [];
  patients: any[] = [];
  selectedExam: any = null;
  newExam: any = {};
  file: File | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  
  // Filtros
  filterPatient: string = '';
  filterStatus: string = '';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.fetchExams();
    this.fetchPatients();
  }

  fetchExams(): void {
    this.apiService.getExams().subscribe({
      next: (data) => this.exams = data,
      error: (err) => this.errorMessage = 'Não foi possível carregar os exames.'
    });
  }

  fetchPatients(): void {
    this.apiService.getPatients().subscribe({
      next: (data) => this.patients = data,
      error: (err) => console.error('Erro ao buscar pacientes:', err)
    });
  }

  createExam(): void {
    const examData = {
      ...this.newExam,
      status: 'PENDENTE'
    };
    this.apiService.createExam(examData).subscribe({
      next: () => {
        this.successMessage = 'Exame cadastrado com sucesso!';
        this.fetchExams();
        this.newExam = {};
      },
      error: (err) => this.errorMessage = 'Erro ao cadastrar exame.'
    });
  }
  
  // Este método atualiza o status, observa o arquivo de laudo e envia para o backend
  updateExamStatusAndUpload(exam: any): void {
    const examToUpdate = { ...exam, status: 'CONCLUÍDO' };
    this.apiService.updateExam(exam.id, examToUpdate).subscribe({
      next: () => {
        if (this.file) {
          this.apiService.uploadReport(exam.id, this.file).subscribe({
            next: () => {
              this.successMessage = 'Exame e laudo atualizados com sucesso!';
              this.fetchExams();
            },
            error: (err) => this.errorMessage = 'Erro ao fazer upload do laudo.'
          });
        } else {
          this.successMessage = 'Exame atualizado para CONCLUÍDO com sucesso!';
          this.fetchExams();
        }
      },
      error: (err) => this.errorMessage = 'Erro ao atualizar exame.'
    });
  }

  onFileSelected(event: any, exam: any): void {
    this.file = event.target.files[0];
    if (this.file) {
      this.updateExamStatusAndUpload(exam);
    }
  }
}