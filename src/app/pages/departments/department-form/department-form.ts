import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Departments as DepartmentsService } from '../../../core/services/departments/departments';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-department-form',
  templateUrl: './department-form.html',
  styleUrl: './department-form.scss',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule, FileUploadModule, ToastModule, ImageModule],
  providers: [MessageService]
})
export class DepartmentForm implements OnInit {
  private fb = inject(FormBuilder);
  private departmentsService = inject(DepartmentsService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  departmentForm: FormGroup;
  isEditMode = signal(false);
  departmentId: string | null = null;
  loading = signal(false);
  selectedFile: File | null = null;
  imagePreview = signal<string | null>(null);
  currentImageUrl = signal<string | null>(null);

  constructor() {
    this.departmentForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit() {
    this.departmentId = this.route.snapshot.paramMap.get('id');
    if (this.departmentId) {
      this.isEditMode.set(true);
      this.loadDepartment(this.departmentId);
    }
  }

  loadDepartment(id: string) {
    this.loading.set(true);
    this.departmentsService.getDepartmentById(id).subscribe({
      next: (data) => {
        this.departmentForm.patchValue({
          name: data.name,
          description: data.description
        });
        this.currentImageUrl.set(data.imageUrl);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading department:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load department details' });
        this.loading.set(false);
      }
    });
  }

  onFileSelect(event: any) {
    const file = event.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview.set(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  onClearFile() {
    this.selectedFile = null;
    this.imagePreview.set(null);
  }

  async onSubmit() {
    if (this.departmentForm.invalid) {
      return;
    }

    this.loading.set(true);
    let imageUrl = this.currentImageUrl();

    try {
      // 1. Upload Image if selected
      if (this.selectedFile) {
        const uploadResponse = await this.departmentsService.uploadImage(this.selectedFile).toPromise();
        if (uploadResponse?.imageUrl) {
            imageUrl = uploadResponse.imageUrl;
        }
      }

      const payload = {
        ...this.departmentForm.value,
        imageUrl: imageUrl || ''
      };

      // 2. Create or Update Department
      if (this.isEditMode() && this.departmentId) {
        await this.departmentsService.updateDepartment(this.departmentId, payload).toPromise();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Department updated successfully' });
      } else {
        await this.departmentsService.createDepartment(payload).toPromise();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Department created successfully' });
      }

      setTimeout(() => {
        this.router.navigate(['/departments']);
      }, 1000);

    } catch (error) {
      console.error('Error saving department:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save department' });
    } finally {
      this.loading.set(false);
    }
  }

  goBack() {
    this.router.navigate(['/departments']);
  }
}
