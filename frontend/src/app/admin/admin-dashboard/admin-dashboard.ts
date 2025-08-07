import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/api';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit {
  stats: any = {};
  examTypes: any[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    // Busca dados do backend para o dashboard
    this.isLoading = true;
    forkJoin({
      stats: this.apiService.getDashboardStats(),
      examsByStatus: this.apiService.getExamsByStatus(),
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
        this.errorMessage = 'Não foi possível carregar os dados do dashboard.';
        this.isLoading = false;
      }
    });
  }
}