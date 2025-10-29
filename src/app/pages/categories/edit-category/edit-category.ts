import { Component, inject } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUpdateCategory } from '../../../core/models/category.model';
import { Categories } from '../../../core/services/categories';
import { ActivatedRoute, Router } from '@angular/router';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-edit-category',
    imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    Toast
  ],
  templateUrl: './edit-category.html',
  styleUrl: './edit-category.scss',
})
export class EditCategory {
  private categoriesService = inject(Categories);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  id = 0;

  updateCategoryForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.updateCategoryForm = this.fb.group({
      name: ['', [Validators.required]],
    });
  }

  isInvalid(fieldName: string): boolean {
    const field = this.updateCategoryForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.updateCategoryForm.valid) {

      const updateCategory: IUpdateCategory = {
        name: this.updateCategoryForm.value.name
      };

      this.activatedRoute.paramMap.subscribe(params => {
        this.id = params.get('id') ? Number(params.get('id')) : 0;
      });

      this.categoriesService.updateCategory( this.id, updateCategory).subscribe({
        next: (response) => {
          this.router.navigate(['/categories']);
        },
        error: (error) => {
          console.error(error);
        }
      });

    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched();
    }
  }

  onReset(): void {
    this.updateCategoryForm.reset();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.updateCategoryForm.controls).forEach(key => {
      const control = this.updateCategoryForm.get(key);
      control?.markAsTouched();
    });
  }
}
