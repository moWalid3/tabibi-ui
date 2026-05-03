import { Component, inject, signal, OnInit, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { ChartModule } from 'primeng/chart';
import { AvatarModule } from 'primeng/avatar';
import { RatingModule } from 'primeng/rating';
import { ProgressBarModule } from 'primeng/progressbar';

import { DashboardService } from '../../core/services/dashboard/dashboard';
import { IAnalyticsDashboard, AppointmentStatus, IChartDataPoint } from '../../core/models/dashboard/analytics.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, CardModule, TableModule, ButtonModule, FormsModule, 
    TagModule, ChartModule, AvatarModule, RatingModule, ProgressBarModule, RouterLink
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private dashboardService = inject(DashboardService);
  Math = Math;
  
  data = signal<IAnalyticsDashboard | null>(null);
  loading = signal(true);
  
  // Charts Data
  overviewChartOptions: any;
  revenueOverviewChartOptions: any;
  revenuePieData: any;
  revenuePieOptions: any;

  // Selected Tabs
  popularDoctorsTab = signal<'weekly' | 'monthly' | 'yearly'>('weekly');
  topDoctorsRevenueTab = signal<'weekly' | 'monthly' | 'yearly'>('weekly');
  topDepartmentsTab = signal<'daily' | 'weekly' | 'monthly'>('weekly');

  topDepartmentsChartOptions: any;

  topDepartmentsChartData = computed(() => {
    const dash = this.data();
    if (!dash) return null;
    const tab = this.topDepartmentsTab();
    const tabData = dash.topDepartments[tab];
    
    return {
      labels: tabData.departments.map(d => d.departmentName),
      datasets: [
        {
          data: tabData.departments.map(d => d.patientsCount),
          backgroundColor: ['#818cf8', '#f59e0b', '#64748b', '#3b82f6', '#14b8a6'],
          hoverBackgroundColor: ['#6366f1', '#d97706', '#475569', '#2563eb', '#0d9488'],
          borderWidth: 0
        }
      ]
    };
  });

  constructor() {
    this.initChartOptions();
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.dashboardService.getSummary().subscribe({
      next: (res) => {
        this.data.set(res);
        this.initChartsData(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load analytics dashboard', err);
        this.loading.set(false);
      }
    });
  }

  // Generate simple line charts for the overview cards
  generateOverviewChart(chartData: IChartDataPoint[], color: string) {
    if (!chartData) return null;
    return {
      labels: chartData.map(d => d.date),
      datasets: [
        {
          label: 'Trend',
          data: chartData.map(d => d.total),
          borderColor: color,
          backgroundColor: color + '20',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4
        }
      ]
    };
  }

  initChartsData(data: IAnalyticsDashboard) {
    // Doughnut Chart: Revenue By Department
    const documentStyle = getComputedStyle(document.documentElement);
    const textBase = documentStyle.getPropertyValue('--p-text-color');
    const textMuted = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    // Prepare Doughnut Chart
    if (data.revenueByDepartment) {
      this.revenuePieData = {
        labels: data.revenueByDepartment.map(d => d.departmentName),
        datasets: [
          {
            data: data.revenueByDepartment.map(d => d.revenue),
            backgroundColor: [
              documentStyle.getPropertyValue('--p-blue-500'),
              documentStyle.getPropertyValue('--p-orange-500'),
              documentStyle.getPropertyValue('--p-green-500'),
              documentStyle.getPropertyValue('--p-purple-500'),
              documentStyle.getPropertyValue('--p-pink-500')
            ],
            hoverBackgroundColor: [
              documentStyle.getPropertyValue('--p-blue-400'),
              documentStyle.getPropertyValue('--p-orange-400'),
              documentStyle.getPropertyValue('--p-green-400'),
              documentStyle.getPropertyValue('--p-purple-400'),
              documentStyle.getPropertyValue('--p-pink-400')
            ]
          }
        ]
      };
    }

    this.revenuePieOptions = {
      cutout: '60%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: textBase }
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              const label = context.label || '';
              const value = context.raw || 0;
              return ` ${label}: $${Number(value).toLocaleString()}`;
            }
          }
        }
      }
    };

    this.topDepartmentsChartOptions = {
      cutout: '75%',
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              const label = context.label || '';
              const value = context.raw || 0;
              return ` ${label}: ${value}`;
            }
          }
        }
      }
    };
  }

  initChartOptions() {
    const getBaseOptions = () => ({
      plugins: { 
        legend: { display: false },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context: any) {
              return ` Total: ${context.parsed.y.toLocaleString()}`;
            }
          }
        }
      },
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        x: { display: false },
        y: { display: false, min: 0 }
      },
      maintainAspectRatio: false,
      responsive: true
    });

    this.overviewChartOptions = getBaseOptions();
    
    this.revenueOverviewChartOptions = getBaseOptions();
    this.revenueOverviewChartOptions.plugins.tooltip.callbacks.label = function(context: any) {
      return ` Total: $${context.parsed.y.toLocaleString()}`;
    };
  }

  // UI Helpers
  getAppointmentStatusName(status: AppointmentStatus): string {
    switch (status) {
      case AppointmentStatus.AwaitingPayment: return 'Awaiting Payment';
      case AppointmentStatus.Confirmed: return 'Confirmed';
      case AppointmentStatus.Completed: return 'Completed';
      case AppointmentStatus.Canceled: return 'Canceled';
      case AppointmentStatus.Refunded: return 'Refunded';
      default: return 'Unknown';
    }
  }

  getAppointmentSeverity(status: AppointmentStatus): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" {
    switch (status) {
      case AppointmentStatus.Confirmed: return 'info';
      case AppointmentStatus.Completed: return 'success';
      case AppointmentStatus.AwaitingPayment: return 'warn';
      case AppointmentStatus.Canceled: return 'danger';
      case AppointmentStatus.Refunded: return 'secondary';
      default: return 'secondary';
    }
  }

  getPercentageColor(percentage: number) {
    return percentage >= 0 ? 'text-green-500' : 'text-red-500';
  }
}
