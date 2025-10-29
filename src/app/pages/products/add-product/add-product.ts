import { Component, inject, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { Select } from 'primeng/select';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IAddProduct } from '../../../core/models/product.model';
import { ICategoryDto } from '../../../core/models/category.model';
import { Products } from '../../../core/services/products';
import { Router } from '@angular/router';
import { Categories } from '../../../core/services/categories';

@Component({
  selector: 'app-add-product',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    FileUpload,
    Select
  ],
  templateUrl: './add-product.html',
  styleUrl: './add-product.scss',
})
export class AddProduct {
  private productsService = inject(Products);
  private categoriesService = inject(Categories);
  private router = inject(Router);

  categories = signal<ICategoryDto[]>([]);

  addProductForm: FormGroup;
  imageFile : File | null = null;

  constructor(private fb: FormBuilder) {
    this.addProductForm = this.createForm();

    this.categoriesService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0)]],
      rating: ['', [Validators.required, Validators.min(0), Validators.max(5)]],
      quantity: ['', [Validators.required, Validators.min(0)]],
      summary: [''],
      description: [''],
      categoryId: ['', [Validators.required]]
    });
  }

  isInvalid(fieldName: string): boolean {
    const field = this.addProductForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onUpload(event: FileSelectEvent) {
    this.imageFile = event.currentFiles[0];
  }

  onSubmit(): void {
    if (this.addProductForm.valid) {
      const formValue = this.addProductForm.value;

      const product: IAddProduct = {
        name: formValue.name,
        price: Number(formValue.price),
        rating: Number(formValue.rating),
        quantity: Number(formValue.quantity),
        summary: formValue.summary,
        description: formValue.description,
        imageFile: this.imageFile,
        categoryId: Number(formValue.categoryId)
      };

      this.productsService.createProduct(product).subscribe({
        next: (response) => {
          console.log(response);
          this.router.navigate(['/products']);
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
    this.addProductForm.reset();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.addProductForm.controls).forEach(key => {
      const control = this.addProductForm.get(key);
      control?.markAsTouched();
    });
  }
}
