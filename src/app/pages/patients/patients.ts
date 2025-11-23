import { Component, inject, signal, ViewChild } from '@angular/core';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { HttpClientModule } from '@angular/common/http';
import { IPatientDto } from '../../core/models/patients/patient.model';
import { Patients as PatientsService } from '../../core/services/patients/patients';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Gender } from '../../core/models/doctors/enums';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.html',
  styleUrl: './patients.scss',
  imports: [TableModule, CommonModule, ButtonModule, HttpClientModule, FormsModule, IconFieldModule, InputIconModule, InputTextModule, SelectModule, ToggleSwitchModule, ChipModule, TagModule, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, MessageService]
})
export class Patients {
  @ViewChild('dt') dt!: Table;
  private patientsService = inject(PatientsService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  Gender = Gender;

  patients = signal<IPatientDto[]>([]);
  totalRecords = signal(0);
  loading = signal(false);

  // Filters
  searchValue = signal('');
  private searchSubject = new Subject<string>();

  selectedCity = signal<any>(null);
  selectedGender = signal<Gender | null>(null);
  selectedEmailConfirmed = signal<boolean | null>(null);

  // Custom Sort
  sortOptions = [
    { label: 'Name', value: 'Name' },
    { label: 'Email', value: 'Email' },
    { label: 'Gender', value: 'Gender' },
    { label: 'City', value: 'City' },
    { label: 'Date Of Birth', value: 'DateOfBirth' },
    { label: 'Created At', value: 'CreatedAtUtc' },
    { label: 'Updated At', value: 'UpdatedAtUtc' }
  ];
  
  selectedSortField = signal<string | null>(null);
  sortDescending = signal(false);
  activeSorts = signal<{ field: string, label: string, desc: boolean }[]>([]);

  cities = signal<any[]>([]);

  genderOptions = [
    { label: 'Male', value: Gender.Male },
    { label: 'Female', value: Gender.Female }
  ];

  emailConfirmedOptions = [
    { label: 'Confirmed', value: true },
    { label: 'Not Confirmed', value: false }
  ];

  ngOnInit(): void {
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

  loadCities() {
    this.patientsService.getCities().subscribe(data => this.cities.set(data));
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

  loadPatients(event?: TableLazyLoadEvent) {
    this.loading.set(true);

    const page = (event?.first ?? 0) / (event?.rows ?? 10) + 1;
    const pageSize = event?.rows ?? 10;
    
    // Construct sort string from activeSorts
    let sort = this.activeSorts().map(s => `${s.field} ${s.desc ? 'desc' : 'asc'}`).join(',');
    
    // Fallback to table sort if no custom sort
    if (!sort && event?.sortField) {
      sort = `${event.sortField} ${event.sortOrder === 1 ? 'asc' : 'desc'}`;
    }

    const params: any = {
      Page: page,
      PageSize: pageSize,
      Sort: sort,
      q: this.searchValue(),
      CityId: this.selectedCity()?.id,
      Gender: this.selectedGender(),
      EmailConfirmed: this.selectedEmailConfirmed()
    };

    // Remove null/undefined/empty params
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === undefined || params[key] === '') {
        delete params[key];
      }
    });

    this.patientsService.getAllPatients(params).subscribe({
      next: (data) => {
        this.patients.set(data.items);
        this.totalRecords.set(data.totalCount);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error fetching patients:', error);
        this.loading.set(false);
      }
    });
  }
  
  reloadTable(table?: any) {
    if (table) {
        table.reset();
    } else if (this.dt) {
        this.dt.reset();
    }
  }

  deletePatient(event: Event, patient: IPatientDto) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete this patient?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",
      accept: () => {
        this.patientsService.deletePatient(patient.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Patient deleted successfully' });
            this.reloadTable();
          },
          error: (error) => {
            console.error('Error deleting patient:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete patient' });
          }
        });
      }
    });
  }
}
