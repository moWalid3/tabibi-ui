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

  signout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('my-app-dark');
  }

  /** Signal for controlling the mobile menu open/close state. */
  isMobileOpen = signal(false);

  /** Signal for controlling the profile dropdown open/close state. */
  isProfileOpen = signal(false);

  /** Toggles the mobile menu state and closes the profile dropdown. */
  toggleMenu() {
    this.isMobileOpen.update(value => !value);
    this.isProfileOpen.set(false); // Close profile dropdown when mobile menu is opened/closed
  }

  /** Toggles the profile dropdown state and closes the mobile menu. */
  toggleProfile() {
    this.isProfileOpen.update(value => !value);
    this.isMobileOpen.set(false); // Close mobile menu when profile dropdown is opened/closed
  }
}
