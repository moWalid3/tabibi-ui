import { Component, inject, signal, ViewChild, OnInit } from '@angular/core';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { BookingsService } from '../../core/services/bookings/bookings';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.html',
  styleUrl: './bookings.scss',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule, FormsModule, SelectModule, DatePickerModule, TagModule]
})
export class Bookings implements OnInit {
  @ViewChild('dt') dt!: Table;
  private bookingsService = inject(BookingsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  bookings = signal<any[]>([]);
  totalRecords = signal(0);
  loading = signal(false);

  // Filters
  selectedStatus = signal<any>(null);
  selectedType = signal<any>(null);
  dateRange = signal<Date[] | null>(null);
  patientIdParam = signal<string | null>(null);
  doctorIdParam = signal<string | null>(null);

  statusOptions = [
    { label: 'Awaiting Payment', value: 0 },
    { label: 'Confirmed', value: 1 },
    { label: 'Completed', value: 2 },
    { label: 'Canceled', value: 3 },
    { label: 'Refunded', value: 4 }
  ];

  typeOptions = [
    { label: 'Clinic', value: 0 },
    { label: 'Video Call', value: 1 }
  ];

  ngOnInit(): void {
    // Check for query params
    this.route.queryParams.subscribe(params => {
      if (params['patientId']) this.patientIdParam.set(params['patientId']);
      if (params['doctorId']) this.doctorIdParam.set(params['doctorId']);
      
      if (params['startDate'] && params['endDate']) {
        const start = new Date(params['startDate']);
        const end = new Date(params['endDate']);
        this.dateRange.set([start, end]);
      }
      
      // small delay to let table init if needed, though lazy load will trigger on its own
      setTimeout(() => this.reloadTable(), 0);
    });
  }

  onFilterChange() {
    this.reloadTable();
  }

  loadBookings(event: TableLazyLoadEvent) {
    this.loading.set(true);

    const page = (event.first ?? 0) / (event.rows ?? 10) + 1;
    const pageSize = event.rows ?? 10;
    
    const params: any = {
      page: page,
      size: pageSize,
    };

    if (this.selectedStatus() !== null) params.status = this.selectedStatus();
    if (this.selectedType() !== null) params.type = this.selectedType();
    if (this.patientIdParam()) params.patientId = this.patientIdParam();
    if (this.doctorIdParam()) params.doctorId = this.doctorIdParam();
    
    const range = this.dateRange();
    if (range && range[0]) {
      params.startDate = this.formatDate(range[0]);
      if (range[1]) {
        params.endDate = this.formatDate(range[1]);
      } else {
        params.endDate = params.startDate; // If only start date is selected
      }
    }

    this.bookingsService.getBookingsOverview(params).subscribe({
      next: (response) => {
        const result = response.JsonResult;
        this.bookings.set(result.data);
        this.totalRecords.set(result.totalCount);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error fetching bookings:', error);
        this.loading.set(false);
      }
    });
  }
  
  reloadTable() {
    if (this.dt) {
      this.dt.reset();
    }
  }

  viewDetails(id: string) {
    this.router.navigate(['/appointments', id]);
  }

  viewPatient(id: string) {
    this.router.navigate(['/patients', id]);
  }

  viewDoctor(id: string) {
    this.router.navigate(['/doctors', id]);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getBookingStatusSeverity(status: number): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch(status) {
      case 0: return 'warn';
      case 1: return 'info';
      case 2: return 'success';
      case 3: return 'danger';
      case 4: return 'secondary';
      default: return 'info';
    }
  }

  getBookingStatusLabel(status: number): string {
    const opt = this.statusOptions.find(o => o.value === status);
    return opt ? opt.label : 'Unknown';
  }

  getBookingTypeLabel(type: number): string {
    return type === 0 ? 'Clinic' : 'Video Call';
  }

  clearFilters() {
    this.selectedStatus.set(null);
    this.selectedType.set(null);
    this.dateRange.set(null);
    this.patientIdParam.set(null);
    this.doctorIdParam.set(null);
    // Clear URL query params
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      replaceUrl: true
    });
    this.reloadTable();
  }
}
