import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html', 
  styleUrls: ['./header.css']    
})
export class HeaderComponent {
  isMenuOpen = false;

  constructor(public authService: AuthService) { }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}