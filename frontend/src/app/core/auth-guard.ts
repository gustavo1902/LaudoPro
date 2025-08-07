import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.authService.isAuthenticated()) {
      const expectedRole = route.data['role'];
      const userRole = this.authService.getUserRole();

      if (expectedRole && userRole && userRole.toUpperCase() === expectedRole.toUpperCase()) {
        return true;
      } else {
        console.warn(`Acesso negado: Perfil ${userRole} não tem acesso a esta rota. Requer: ${expectedRole}`);
        this.router.navigate(['/']);
        return false;
      }
    } else {
      console.log('Não autenticado, redirecionando para login.');
      this.router.navigate(['/login']);
      return false;
    }
  }
}