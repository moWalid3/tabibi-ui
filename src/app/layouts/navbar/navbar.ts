import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { ButtonModule } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, ButtonModule, Tooltip],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  authService = inject(Auth);
  private router = inject(Router);

  isDarkMode = signal<boolean>(false);

  constructor() {
    // Initialize dark mode from local storage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode.set(true);
      document.querySelector('html')?.classList.add('my-app-dark');
    } else {
      this.isDarkMode.set(false);
      document.querySelector('html')?.classList.remove('my-app-dark');
    }
  }

  signout() {
    this.authService.logout();
  }

  toggleDarkMode() {
    this.isDarkMode.update(val => !val);
    const element = document.querySelector('html');
    
    if (this.isDarkMode()) {
      element?.classList.add('my-app-dark');
      localStorage.setItem('theme', 'dark');
    } else {
      element?.classList.remove('my-app-dark');
      localStorage.setItem('theme', 'light');
    }
  }
}
