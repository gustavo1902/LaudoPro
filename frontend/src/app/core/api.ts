import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) { }

  // Gestão de Pacientes
  getPatients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pacientes`);
  }

  getPatientsCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/pacientes/count`);
  }

  createPatient(patient: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/pacientes`, patient);
  }

  updatePatient(id: number, patient: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/pacientes/${id}`, patient);
  }

  deletePatient(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/pacientes/${id}`);
  }

  // Gestão de Exames
  getExams(filters: any = {}): Observable<any[]> {
    let params = new HttpParams();
    if (filters.patientId) params = params.set('patientId', filters.patientId);
    if (filters.status) params = params.set('status', filters.status);
    if (filters.date) params = params.set('date', filters.date);

    return this.http.get<any[]>(`${this.apiUrl}/exames`, { params });
  }

  createExam(exam: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/exames`, exam);
  }

  updateExam(id: number, exam: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/exames/${id}`, exam);
  }
  
  uploadReport(examId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(`${this.apiUrl}/exames/${examId}/laudo`, formData);
  }

  // Dashboard (Admin)
  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard/stats`);
  }
  
  getExamsByStatus(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/dashboard/exams-by-status`);
  }

  // Área do Paciente
  getMyExams(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/paciente/meus-exames`);
  }

  downloadReport(examId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/paciente/exames/${examId}/laudo/download`, { responseType: 'blob' });
  }

  getPatientProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/paciente/perfil`);
  }
  
  updatePatientProfile(profile: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/paciente/perfil`, profile);
  }
}