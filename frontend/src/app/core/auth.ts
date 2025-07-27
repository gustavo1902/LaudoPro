import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private apiUrl = '/api/auth';

  constructor(private http: HttpClient, private router: Router) { }

  private hasToken(): boolean {
    return !!localStorage.getItem('jwtToken');
  }

  login(email: string, senha: string): Observable<string> {
    return this.http.post(this.apiUrl + '/login', { email, senha }, { responseType: 'text' }).pipe(
      tap((tokenWithBearer: string) => {
        const token = tokenWithBearer.replace('Bearer ', '');
        localStorage.setItem('jwtToken', token);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('jwtToken');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getUserProfile(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const payload = token.split('.')[1];
        const decodedToken = JSON.parse(atob(payload));
        const email = decodedToken.sub;

        if (email === 'admin@laudopro.com') {
            return 'ROLE_ADMIN';
        } else if (email === 'paciente@laudopro.com') {
            return 'ROLE_PACIENTE';
        }
        return null;
      } catch (e) {
        console.error('Erro ao decodificar JWT ou parsear perfil:', e);
        return null;
      }
    }
    return null;
  }

  isAdmin(): boolean {
    return this.getUserProfile() === 'ROLE_ADMIN';
  }

  isPatient(): boolean {
    return this.getUserProfile() === 'ROLE_PACIENTE';
  }
}