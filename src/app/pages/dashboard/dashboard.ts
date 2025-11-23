import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { DashboardService } from '../../core/services/dashboard/dashboard';
import { IDashboardSummary } from '../../core/models/dashboard/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, ButtonModule, FormsModule, TagModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private dashboardService = inject(DashboardService);
  
  stats = signal<IDashboardSummary>({
    totalDoctors: 0,
    totalPendingDoctors: 0,
    totalApprovedDoctors: 0,
    totalPatients: 0
  });

  loading = signal(true);
  date = signal<Date | null>(new Date());
  
  // Mock data for appointments (keeping as placeholder for now)
  appointments = signal([
    { id: 1, patient: 'Karim Mahmoud', time: '10:00 AM', doctor: 'Dr. Karma', status: 'Confirmed' },
    { id: 2, patient: 'Ammar Ahmed', time: '5:00 PM', doctor: 'Dr. Ahmed', status: 'Pending' },
    { id: 3, patient: 'Samar Mostafa', time: '9:00 AM', doctor: 'Dr. Sara', status: 'Cancelled' },
    { id: 4, patient: 'Mahmoud Ahmed', time: '8:00 AM', doctor: 'Dr. Abdullah', status: 'Confirmed' },
    { id: 5, patient: 'Fatima Amr', time: '11:00 PM', doctor: 'Dr. Sami', status: 'No Show' },
  ]);

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.dashboardService.getSummary().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load dashboard stats', err);
        this.loading.set(false);
      }
    });
  }

  getStatusSeverity(status: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined {
    switch (status) {
      case 'Confirmed':
        return 'success';
      case 'Pending':
        return 'info';
      case 'Cancelled':
        return 'danger';
      case 'No Show':
        return 'warn';
      default:
        return 'secondary';
    }
  }
}
