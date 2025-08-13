import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class PatientDashboard implements OnInit {
  patientProfile: any = {};
  recentExams: any[] = [];
  stats = {
    total: 0,
    completed: 0,
    pending: 0
  };

  isLoading = true;
  errorMessage: string | null = null;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.isLoading = true;

    forkJoin({
      profile: this.apiService.getPatientProfile(),
      exams: this.apiService.getMyExams()
    }).subscribe({
      next: ({ profile, exams }) => {
        this.patientProfile = profile;
        this.processExams(exams);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dados do dashboard:', err);
        this.errorMessage = 'Não foi possível carregar as informações do dashboard. Tente novamente mais tarde.';
        this.isLoading = false;
      }
    });
  }

  private processExams(exams: any[]): void {
    const sortedExams = [...exams].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    this.recentExams = sortedExams.slice(0, 5);
    this.stats.total = exams.length;
    this.stats.completed = exams.filter(e => e.status === 'CONCLUÍDO').length;
    this.stats.pending = exams.filter(e => e.status === 'PENDENTE').length;
  }
}
