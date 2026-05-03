import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ButtonModule, TooltipModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  isCollapsed = signal(false);

  toggleSidebar() {
    this.isCollapsed.update(v => !v);
  }

  menuItems = [
    { label: 'Dashboard', icon: 'pi pi-home', route: '/dashboard' },
    { label: 'Patients', icon: 'pi pi-users', route: '/patients' },
    { label: 'Doctors', icon: 'pi pi-id-card', route: '/doctors' },
    { label: 'Appointments', icon: 'pi pi-calendar', route: '/appointments' },
    { label: 'Reviews', icon: 'pi pi-star', route: '/reviews' },
    { label: 'All Patients', icon: 'pi pi-users', route: '/all-patients' },
    { label: 'All Doctors', icon: 'pi pi-id-card', route: '/all-doctors' },
    { label: 'Departments', icon: 'pi pi-building', route: '/departments' },
    { label: 'Cities', icon: 'pi pi-map-marker', route: '/cities' },

  ];
}
