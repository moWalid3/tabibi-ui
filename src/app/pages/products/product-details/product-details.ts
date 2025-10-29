import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Products } from '../../../core/services/products';
import { IProductWithCategory } from '../../../core/models/product.model';
import { Rating } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { Button } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-product-details',
  imports: [Rating, FormsModule, CurrencyPipe, Button, DividerModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss'
})
export class ProductDetails {
  private productsService = inject(Products);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  id = signal<number>(0);
  product = signal<IProductWithCategory | null>(null);

  constructor() {
    this.activatedRoute.paramMap.subscribe(params => {
      const productId = params.get('id');
      if (productId) {
        this.id.set(Number(productId));
        this.loadProductDetails(this.id());
      }
    });
  }

  private loadProductDetails(id: number): void {
    this.productsService.getProductById(id).subscribe({
      next: (product) => {
        this.product.set(product);
      },
      error: (error) => {
        console.error('Error fetching product details:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
