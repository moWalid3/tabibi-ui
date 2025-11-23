import { Component, inject, signal, ViewChild } from '@angular/core';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { HttpClientModule } from '@angular/common/http';
import { IDepartmentDto } from '../../core/models/departments/department.model';
import { Departments as DepartmentsService } from '../../core/services/departments/departments';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ChipModule } from 'primeng/chip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.html',
  styleUrl: './departments.scss',
  imports: [TableModule, CommonModule, ButtonModule, HttpClientModule, FormsModule, IconFieldModule, InputIconModule, InputTextModule, SelectModule, ToggleSwitchModule, ChipModule, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, MessageService]
})
export class Departments {
  @ViewChild('dt') dt!: Table;
  private departmentsService = inject(DepartmentsService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  departments = signal<IDepartmentDto[]>([]);
  totalRecords = signal(0);
  loading = signal(false);

  // Filters
  searchValue = signal('');
  private searchSubject = new Subject<string>();

  // Custom Sort
  sortOptions = [
    { label: 'Name', value: 'Name' },
    { label: 'Created At', value: 'CreatedAtUtc' }
  ];
  
  selectedSortField = signal<string | null>(null);
  sortDescending = signal(false);
  activeSorts = signal<{ field: string, label: string, desc: boolean }[]>([]);

  ngOnInit() {
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



  addSort() {
    const field = this.selectedSortField();
    if (field) {
      const label = this.sortOptions.find(o => o.value === field)?.label || field;
      const currentSorts = this.activeSorts();
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

  loadDepartments(event?: TableLazyLoadEvent) {
    this.loading.set(true);

    const page = (event?.first ?? 0) / (event?.rows ?? 10) + 1;
    const pageSize = event?.rows ?? 10;
    
    let sort = this.activeSorts().map(s => `${s.field} ${s.desc ? 'desc' : 'asc'}`).join(',');
    
    if (!sort && event?.sortField) {
      sort = `${event.sortField} ${event.sortOrder === 1 ? 'asc' : 'desc'}`;
    }

    const params: any = {
      Page: page,
      PageSize: pageSize,
      Sort: sort,
      q: this.searchValue(),
    };

    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === undefined || params[key] === '') {
        delete params[key];
      }
    });

    this.departmentsService.getAllDepartments(params).subscribe({
      next: (data) => {
        this.departments.set(data.items);
        this.totalRecords.set(data.totalCount);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error fetching departments:', error);
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

  viewDetails(id: string) {
    this.router.navigate(['/departments', id]);
  }

  editDepartment(id: string) {
    this.router.navigate(['/departments', id, 'edit']);
  }

  createDepartment() {
    this.router.navigate(['/departments', 'new']);
  }

  deleteDepartment(event: Event, department: IDepartmentDto) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete this department?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",
      accept: () => {
        this.departmentsService.deleteDepartment(department.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Department deleted successfully' });
            this.reloadTable();
          },
          error: (error) => {
            console.error('Error deleting department:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete department' });
          }
        });
      }
    });
  }
}
