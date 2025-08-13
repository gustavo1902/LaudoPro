import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../core/api';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-exam-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule], 
  templateUrl: './exam-management.html',
  styleUrl: './exam-management.css'
})
export class ExamManagement implements OnInit {
  exams: any[] = [];
  patients: any[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;
  filterForm: FormGroup;
  fileToUpload: { [examId: number]: File } = {};

  isResultModalVisible = false;
  examForModal: any = null;
  resultForm: FormGroup;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      patientId: [''],
      status: [''],
      date: ['']
    });

    this.resultForm = this.fb.group({
      resultado: ['', Validators.required],
      observacoes: ['']
    });
  }

  ngOnInit(): void {
    this.fetchPatients();
    this.fetchExames();

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
  
  updateStatus(examId: number, newStatus: string): void {
    this.clearMessages();
    const exam = this.exams.find(e => e.id === examId);

    if (!exam) return;

    if (newStatus === 'CONCLUÍDO') {
      this.examForModal = exam;
      this.resultForm.setValue({
        resultado: exam.resultado || '',
        observacoes: exam.observacoes || ''
      });
      this.isResultModalVisible = true;
    } else {
      const payload = { status: newStatus };
      this.apiService.updateExam(examId, payload).subscribe({
        next: () => {
          this.successMessage = `Status do exame #${examId} atualizado para ${newStatus}.`;
          exam.status = newStatus;
        },
        error: (err) => {
          this.errorMessage = `Erro ao atualizar o status do exame #${examId}.`;
          this.fetchExames();
        }
      });
    }
  }

  saveExamResult(): void {
    if (this.resultForm.invalid) {
      this.resultForm.markAllAsTouched();
      return; 
    }

    const payload = {
      status: 'CONCLUÍDO',
      ...this.resultForm.value
    };

    this.apiService.updateExam(this.examForModal.id, payload).subscribe({
      next: (updatedExam) => {
        this.successMessage = `Exame #${this.examForModal.id} concluído e laudo salvo com sucesso.`;
        const index = this.exams.findIndex(e => e.id === this.examForModal.id);
        if (index !== -1) {
          this.exams[index] = updatedExam;
        }
        this.closeResultModal();
      },
      error: (err) => {
        this.errorMessage = 'Erro ao salvar o resultado do exame.';
      }
    });
  }

  closeResultModal(): void {
    this.isResultModalVisible = false;
    this.examForModal = null;
    this.resultForm.reset();
  }

  onFileSelected(event: any, examId: number): void {
    this.clearMessages();
    const file: File = event.target.files[0];

    if (file) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      const maxSizeInBytes = 10 * 1024 * 1024;

      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = 'Tipo de arquivo inválido. Apenas PDF, JPG e PNG são permitidos.';
        (event.target as HTMLInputElement).value = '';
        return;
      }

      if (file.size > maxSizeInBytes) {
        this.errorMessage = `O arquivo é muito grande (${(file.size / 1024 / 1024).toFixed(2)} MB). O tamanho máximo é 10 MB.`;
        (event.target as HTMLInputElement).value = '';
        return;
      }
      
      this.fileToUpload[examId] = file;
    }
  }

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
        delete this.fileToUpload[examId];
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