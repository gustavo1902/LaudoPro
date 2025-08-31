import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/api';

@Component({
  selector: 'app-my-exams',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-exams.html',
  styleUrls: ['./my-exams.css']
})
export class MyExams implements OnInit {
  exams: any[] = [];
  errorMessage: string | null = null;
  
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getMyExams().subscribe({
      next: (data) => this.exams = data,
      error: (err) => this.errorMessage = 'Não foi possível carregar seus exames.'
    });
  }

  downloadReport(examId: number, examType: string): void {
    this.apiService.downloadReport(examId).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `laudo_${examType}_${examId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      },
      error: (err) => this.errorMessage = 'Erro ao baixar o laudo.'
    });
  }
}