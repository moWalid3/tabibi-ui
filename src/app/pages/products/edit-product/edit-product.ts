import { Component, inject, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { Select } from 'primeng/select';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUpdateProduct } from '../../../core/models/product.model';
import { ICategoryDto } from '../../../core/models/category.model';
import { Products } from '../../../core/services/products';
import { ActivatedRoute, Router } from '@angular/router';
import { Categories } from '../../../core/services/categories';

@Component({
  selector: 'app-edit-product',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    FileUpload,
    Select
  ],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.scss'
})
export class EditProduct {
  private productsService = inject(Products);
  private categoriesService = inject(Categories);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  id = signal<number>(0);

  categories = signal<ICategoryDto[]>([]);

  updateProductForm: FormGroup;
  imageFile : File | null = null;
  imageUrl = signal<string | null>(null);

  constructor(private fb: FormBuilder) {
    this.updateProductForm = this.createForm();

    this.activatedRoute.paramMap.subscribe(params => {
      const productId = params.get('id');
      if (productId) {
        this.id.set(Number(productId));
        this.productsService.getProductById(this.id()).subscribe({
          next: (product) => {
            this.updateProductForm.patchValue({
              name: product.name,
              price: product.price,
              rating: product.rating,
              quantity: product.quantity,
              summary: product.summary,
              description: product.description,
              categoryId: product.categoryId
            });
            this.imageUrl.set(product.imageUrl);
          },
          error: (error) => {
            console.error(error);
          }
        });
      }
    });

    // Fetch categories for the select dropdown
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
    const field = this.updateProductForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onUpload(event: FileSelectEvent) {
    this.imageFile = event.currentFiles[0];
    this.imageUrl.set(null);
  }

  onSubmit(): void {
    if (this.updateProductForm.valid) {
      const formValue = this.updateProductForm.value;

      const product: IUpdateProduct = {
        name: formValue.name,
        price: Number(formValue.price),
        rating: Number(formValue.rating),
        quantity: Number(formValue.quantity),
        summary: formValue.summary,
        description: formValue.description,
        imageFile: this.imageFile,
        categoryId: Number(formValue.categoryId)
      };

      this.productsService.updateProduct(this.id(), product).subscribe({
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
    this.updateProductForm.reset();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.updateProductForm.controls).forEach(key => {
      const control = this.updateProductForm.get(key);
      control?.markAsTouched();
    });
  }
}
