import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth'; 

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.authService.isAuthenticated()) {
      const expectedRole = route.data['role'];

      if (expectedRole) {
        const userProfile = this.authService.getUserProfile();
        // A role no `data` da rota é uma string simples ('ADMIN', 'PACIENTE').
        // A role retornada por `getUserProfile` é 'ROLE_ADMIN' ou 'ROLE_PACIENTE'.
        // Precisamos que os formatos coincidam para a comparação.
        // Ajuste aqui para comparar corretamente:
        if (`ROLE_${(expectedRole as string).toUpperCase()}` === userProfile) {
          return true;
        } else {
          console.warn(`Acesso negado: Perfil ${userProfile} não tem acesso a esta rota. Requer: ${expectedRole}`);
          this.router.navigate(['/']);
          return false;
        }
      }
      return true;
    } else {
      console.log('Não autenticado, redirecionando para login.');
      this.router.navigate(['/login']);
      return false;
    }
  }
}