import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { ActivatedRoute, Router } from '@angular/router';
import { Departments as DepartmentsService } from '../../../core/services/departments/departments';
import { IDepartmentDto } from '../../../core/models/departments/department.model';

@Component({
  selector: 'app-department-details',
  templateUrl: './department-details.html',
  styleUrl: './department-details.scss',
  imports: [CommonModule, ButtonModule, ImageModule]
})
export class DepartmentDetails implements OnInit {
  private departmentsService = inject(DepartmentsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  department = signal<IDepartmentDto | null>(null);
  loading = signal(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDepartment(id);
    }
  }

  loadDepartment(id: string) {
    this.loading.set(true);
    this.departmentsService.getDepartmentById(id).subscribe({
      next: (data) => {
        this.department.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading department details:', error);
        this.loading.set(false);
      }
    });
  }

  goBack() {
    this.router.navigate(['/departments']);
  }

  editDepartment() {
    const dept = this.department();
    if (dept) {
      this.router.navigate(['/departments', dept.id, 'edit']);
    }
  }
}
