import { Component, inject, signal, ViewChild } from '@angular/core';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { HttpClientModule } from '@angular/common/http';
import { IDoctorDto } from '../../core/models/doctors/doctor.model';
import { Doctors as DoctorsService } from '../../core/services/doctors/doctors';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DoctorStatus, Gender } from '../../core/models/doctors/enums';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ChipModule } from 'primeng/chip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';

import { TagModule } from 'primeng/tag';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.html',
  styleUrl: './doctors.scss',
  imports: [TableModule, CommonModule, ButtonModule, HttpClientModule, FormsModule, IconFieldModule, InputIconModule, InputTextModule, SelectModule, ToggleSwitchModule, ChipModule, ConfirmDialogModule, ToastModule, TagModule],
  providers: [ConfirmationService, MessageService]
})
export class Doctors {
  @ViewChild('dt') dt!: Table;
  private doctorsService = inject(DoctorsService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  Gender = Gender;

  doctors = signal<IDoctorDto[]>([]);
  totalRecords = signal(0);
  loading = signal(false);

  // Filters
  searchValue = signal('');
  private searchSubject = new Subject<string>();

  selectedDepartment = signal<any>(null);
  selectedCity = signal<any>(null);
  selectedGender = signal<Gender | null>(null);
  selectedStatus = signal<DoctorStatus | null>(null);
  selectedEmailConfirmed = signal<boolean | null>(null);

  // Custom Sort
  sortOptions = [
    { label: 'Name', value: 'Name' },
    { label: 'Email', value: 'Email' },
    { label: 'Gender', value: 'Gender' },
    { label: 'Status', value: 'Status' },
    { label: 'Consultation Fee', value: 'ConsultationFee' },
    { label: 'Years Of Experience', value: 'YearsOfExperience' },
    { label: 'Department', value: 'Department' },
    { label: 'City', value: 'City' },
    { label: 'Date Of Birth', value: 'DateOfBirth' },
    { label: 'Created At', value: 'CreatedAtUtc' },
    { label: 'Updated At', value: 'UpdatedAtUtc' }
  ];
  
  selectedSortField = signal<string | null>(null);
  sortDescending = signal(false);
  activeSorts = signal<{ field: string, label: string, desc: boolean }[]>([]);

  departments = signal<any[]>([]);
  cities = signal<any[]>([]);

  genderOptions = [
    { label: 'Male', value: Gender.Male },
    { label: 'Female', value: Gender.Female }
  ];

  statusOptions = [
    { label: 'New', value: DoctorStatus.New },
    { label: 'Pending', value: DoctorStatus.Pending },
    { label: 'Approved', value: DoctorStatus.Approved },
    { label: 'Rejected', value: DoctorStatus.Rejected }
  ];

  emailConfirmedOptions = [
    { label: 'Confirmed', value: true },
    { label: 'Not Confirmed', value: false }
  ];

  ngOnInit(): void {
    this.loadDepartments();
    this.loadCities();

    // Debounce search input
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(value => {
      this.searchValue.set(value);
      this.reloadTable();
    });
  }

  onSearch(value: string) {
    this.searchSubject.next(value);
  }

  loadDepartments() {
    this.doctorsService.getDepartments().subscribe(data => this.departments.set(data.items));
  }

  loadCities() {
    this.doctorsService.getCities().subscribe(data => this.cities.set(data));
  }

  addSort() {
    const field = this.selectedSortField();
    if (field) {
      const label = this.sortOptions.find(o => o.value === field)?.label || field;
      const currentSorts = this.activeSorts();
      // Remove existing sort for same field if any
      const newSorts = currentSorts.filter(s => s.field !== field);
      newSorts.push({ field, label, desc: this.sortDescending() });
      this.activeSorts.set(newSorts);
      this.selectedSortField.set(null);
      this.sortDescending.set(false);
    }
  }

  removeSort(field: string) {
    this.activeSorts.set(this.activeSorts().filter(s => s.field !== field));
  }

  clearSorts() {
    this.activeSorts.set([]);
    this.reloadTable();
  }

  applySort() {
    this.reloadTable();
  }

  loadDoctors(event?: TableLazyLoadEvent) {
    this.loading.set(true);

    const page = (event?.first ?? 0) / (event?.rows ?? 10) + 1;
    const pageSize = event?.rows ?? 10;
    
    // Construct sort string from activeSorts
    let sort = this.activeSorts().map(s => `${s.field} ${s.desc ? 'desc' : 'asc'}`).join(',');
    
    // Fallback to table sort if no custom sort (optional, or we can disable table sort)
    if (!sort && event?.sortField) {
      sort = `${event.sortField} ${event.sortOrder === 1 ? 'asc' : 'desc'}`;
    }

    const params: any = {
      Page: page,
      PageSize: pageSize,
      Sort: sort,
      q: this.searchValue(),
      DepartmentId: this.selectedDepartment()?.id,
      CityId: this.selectedCity()?.id,
      Gender: this.selectedGender(),
      Status: this.selectedStatus(),
      EmailConfirmed: this.selectedEmailConfirmed()
    };

    // Remove null/undefined/empty params
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === undefined || params[key] === '') {
        delete params[key];
      }
    });

    this.doctorsService.getAllDoctors(params).subscribe({
      next: (data) => {
        this.doctors.set(data.items);
        this.totalRecords.set(data.totalCount); // Assuming API returns totalCount
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error fetching doctors:', error);
        this.loading.set(false);
      }
    });
  }

  onFilterChange() {
    // Trigger table reload manually or rely on binding if using a ViewChild, 
    // but simpler is to just call loadDoctors with a mock event or reset table.
    // For simplicity with PrimeNG, usually we reset the table or trigger a load.
    // Here we will just let the user interact with the table or add a search button.
    // But to make it reactive, we can use a ViewChild to reset.
    // For now, let's assume the template handles the event triggering (e.g. (onLazyLoad)).
    // To force reload, we might need to access the table instance.
  }
  
  // Helper to trigger reload when filters change
  reloadTable(table?: any) {
    if (table) {
        table.reset();
    } else if (this.dt) {
        this.dt.reset();
    }
  }

  viewDetails(id: string) {
    this.router.navigate(['/doctors', id]);
  }

  deleteDoctor(event: Event, doctor: IDoctorDto) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete this doctor?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",
      accept: () => {
        this.doctorsService.deleteDoctor(doctor.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Doctor deleted successfully' });
            this.reloadTable();
          },
          error: (error) => {
            console.error('Error deleting doctor:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete doctor' });
          }
        });
      }
    });
  }
}
