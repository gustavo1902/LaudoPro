import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../../core/api';
import { forkJoin } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  stats: any = {};
  examTypes: any[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  filterForm: FormGroup;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadDashboardData();
    this.filterForm.valueChanges.pipe(
      debounceTime(400)
    ).subscribe(values => {
      if ((values.startDate && values.endDate) || (!values.startDate && !values.endDate)) {
        this.loadDashboardData();
      }
    });
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = null;
    const filters = this.filterForm.value;

    forkJoin({
      stats: this.apiService.getDashboardStats(filters),
      examsByStatus: this.apiService.getExamsByStatus(filters),
      patientsCount: this.apiService.getPatientsCount()
    }).subscribe({
      next: ({ stats, examsByStatus, patientsCount }) => {
        this.stats = {
          exams: stats.totalExams,
          patients: patientsCount,
          completedExams: examsByStatus.find(s => s.status === 'CONCLUÍDO')?.count || 0
        };
        this.examTypes = stats.examsByType;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar dados do dashboard:', err);
        this.errorMessage = 'Não foi possível carregar os dados do dashboard com os filtros aplicados.';
        this.isLoading = false;
      }
    });
  }

  resetFilters(): void {
    this.filterForm.reset({ startDate: '', endDate: '' });
  }
}