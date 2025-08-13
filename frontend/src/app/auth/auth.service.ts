import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') || '{}'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  public isLoggedIn(): boolean {
    return this.currentUserValue && this.currentUserValue.token;
  }

  register(name: string, email: string, password: string, role: 'PATIENT' | 'ADMIN'): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, {
      name,
      email,
      password,
      role
    });
  }

  // Method to check if user can access registration
  canAccessRegistration(): boolean {
    // Only allow access to registration if user is not logged in
    return !this.isLoggedIn();
  }
}
