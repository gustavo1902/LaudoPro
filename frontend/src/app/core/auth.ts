import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private readonly apiUrl = 'http://localhost:8080/api/auth'; // Usando URL completa para simulação, nginx.conf lida com o proxy

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.isAuthenticatedSubject.next(this.hasToken());
    }
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  login(email: string, senha: string): Observable<any> {
    return this.http.post(this.apiUrl + '/login', { email, senha }).pipe(
      tap((response: any) => {
        const token = response.token;
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('jwtToken', token);
        }
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('jwtToken');
    }
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('jwtToken');
    }
    return null;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.role; // Assume que a role está no payload do JWT
      } catch (e) {
        console.error('Erro ao decodificar JWT:', e);
        return null;
      }
    }
    return null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  isPatient(): boolean {
    return this.getUserRole() === 'PACIENTE';
  }
}