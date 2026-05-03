import { Component, inject, signal, ViewChild, OnInit } from '@angular/core';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Router } from '@angular/router';
import { Doctors as DoctorsService } from '../../core/services/doctors/doctors';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.html',
  styleUrl: './doctors.scss',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule, FormsModule, IconFieldModule, InputIconModule, InputTextModule, SelectModule, RatingModule, TagModule]
})
export class Doctors implements OnInit {
  @ViewChild('dt') dt!: Table;
  private doctorsService = inject(DoctorsService);
  private router = inject(Router);

  doctors = signal<any[]>([]);
  totalRecords = signal(0);
  loading = signal(false);

  // Filters
  searchValue = signal('');
  private searchSubject = new Subject<string>();
  
  selectedCity = signal<any>(null);
  cities = signal<any[]>([]);
  
  selectedDepartment = signal<any>(null);
  departments = signal<any[]>([]);

  ngOnInit(): void {
    this.loadCities();
    this.loadDepartments();
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(value => {
      this.searchValue.set(value);
      this.reloadTable();
    });
  }

  loadCities() {
    this.doctorsService.getCities().subscribe(data => this.cities.set(data));
  }
  
  loadDepartments() {
    this.doctorsService.getDepartments().subscribe(data => this.departments.set(data.items));
  }

  onSearch(value: string) {
    this.searchSubject.next(value);
  }

  onFilterChange() {
    this.reloadTable();
  }

  loadDoctors(event: TableLazyLoadEvent) {
    this.loading.set(true);

    const page = (event.first ?? 0) / (event.rows ?? 10) + 1;
    const pageSize = event.rows ?? 10;
    
    let sortBy = '';
    let sortOrder = '';

    if (event.sortField) {
      sortBy = event.sortField as string;
      sortOrder = event.sortOrder === 1 ? 'ASC' : 'DESC';
    }

    const params: any = {
      page: page,
      size: pageSize,
    };

    if (this.searchValue()) params.search = this.searchValue();
    if (this.selectedCity()?.id) params.cityId = this.selectedCity().id;
    if (this.selectedDepartment()?.id) params.departmentId = this.selectedDepartment().id;
    if (sortBy) {
      params.sortBy = sortBy;
      params.sortOrder = sortOrder;
    }

    this.doctorsService.getDoctorsOverview(params).subscribe({
      next: (response) => {
        const result = response.JsonResult;
        this.doctors.set(result.data);
        this.totalRecords.set(result.totalCount);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error fetching doctors:', error);
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
    this.router.navigate(['/doctors', id]);
  }
}
