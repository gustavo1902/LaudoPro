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
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard implements OnInit {
  stats: any = {};
  examTypes: any[] = [];
  maxCount: number = 0;
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
      patientsCount: this.apiService.getPatientsCount()
    }).subscribe({
      next: ({ stats, patientsCount }) => {
        this.stats = {
          exams: stats.totalExams,
          patients: patientsCount
        };
        this.examTypes = stats.examsByType;

        this.maxCount = this.examTypes.length > 0
          ? Math.max(...this.examTypes.map(t => t.count))
          : 0;

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