import { Component, inject } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IAddCategory } from '../../../core/models/category.model';
import { Categories } from '../../../core/services/categories';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-category',
    imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
  ],
  templateUrl: './add-category.html',
  styleUrl: './add-category.scss',
})
export class AddCategory {
  private categoriesService = inject(Categories);
  private router = inject(Router);
  addCategoryForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.addCategoryForm = this.fb.group({
      name: ['', [Validators.required]],
    });
  }

  isInvalid(fieldName: string): boolean {
    const field = this.addCategoryForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.addCategoryForm.valid) {

      const category: IAddCategory = {
        name: this.addCategoryForm.value.name
      };

      this.categoriesService.createCategory(category).subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.error(error);
        }
      });

      this.router.navigate(['/categories']);
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched();
    }
  }

  onReset(): void {
    this.addCategoryForm.reset();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.addCategoryForm.controls).forEach(key => {
      const control = this.addCategoryForm.get(key);
      control?.markAsTouched();
    });
  }
}
