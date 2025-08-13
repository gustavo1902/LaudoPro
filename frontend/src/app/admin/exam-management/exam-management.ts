import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../../core/api';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-exam-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule], 
  templateUrl: './exam-management.html',
})
export class ExamManagement implements OnInit {
  exams: any[] = [];
  patients: any[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;
  
  filterForm: FormGroup;
  fileToUpload: { [examId: number]: File } = {};

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder 
  ) {
    this.filterForm = this.fb.group({
      patientId: [''], 
      status: [''],
      date: ['']
    });
  }

  ngOnInit(): void {
    this.fetchPatients();
    this.fetchExames();   

    // Escuta as mudanças nos filtros para buscar os dados automaticamente
    this.filterForm.valueChanges.pipe(
      debounceTime(400), 
      distinctUntilChanged() 
    ).subscribe(() => {
      this.fetchExames();
    });
  }

  fetchExames(): void {
    const filters = this.filterForm.value;
    this.apiService.getExams(filters).subscribe({
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
  
  // Método para atualizar o status 
  updateStatus(examId: number, newStatus: string): void {
    this.clearMessages();
    const examToUpdate = { status: newStatus };

    this.apiService.updateExam(examId, examToUpdate).subscribe({
      next: () => {
        this.successMessage = `Exame #${examId} atualizado para ${newStatus}.`;
        // Atualiza o status localmente para resposta visual imediata
        const exam = this.exams.find(e => e.id === examId);
        if (exam) exam.status = newStatus;
      },
      error: () => this.errorMessage = 'Erro ao atualizar o status do exame.'
    });
  }

  // Prepara o arquivo para o upload
  onFileSelected(event: any, examId: number): void {
    const file: File = event.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = 'Tipo de arquivo inválido. Apenas PDF, JPG e PNG são permitidos.';
        return;
      }
      if (file.size > 10 * 1024 * 1024) { 
        this.errorMessage = 'O arquivo é muito grande. O tamanho máximo é 10MB.';
        return;
      }
      this.fileToUpload[examId] = file;
      this.clearMessages();
    }
  }

  // Realiza o upload do laudo
  uploadReport(examId: number): void {
    this.clearMessages();
    const file = this.fileToUpload[examId];
    if (!file) {
      this.errorMessage = "Nenhum arquivo selecionado para o exame #" + examId;
      return;
    }

    this.apiService.uploadReport(examId, file).subscribe({
      next: () => {
        this.successMessage = `Laudo para o exame #${examId} enviado com sucesso!`;
        this.updateStatus(examId, 'CONCLUÍDO');
        delete this.fileToUpload[examId]; // Limpa o arquivo após o upload
      },
      error: () => this.errorMessage = 'Erro ao fazer upload do laudo.'
    });
  }

  resetFilters(): void {
    this.filterForm.reset({ patientId: '', status: '', date: '' });
  }

  private clearMessages(): void {
    this.errorMessage = null;
    this.successMessage = null;
  }
}