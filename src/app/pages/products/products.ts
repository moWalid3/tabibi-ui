import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Rating } from 'primeng/rating';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { Products as ProductsService } from '../../core/services/products';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import {
  IGetAllProductsRequestParams,
  IProductDto,
} from '../../core/models/product.model';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  imports: [
    RouterLink,
    ButtonModule,
    TableModule,
    Toast,
    CurrencyPipe,
    Rating,
    FormsModule,
    ButtonGroupModule,
    InputTextModule,
    SelectModule,
  ],
  templateUrl: './products.html',
  styleUrl: './products.scss',
  providers: [MessageService],
})
export class Products {
  private productsService = inject(ProductsService);
  private messageService = inject(MessageService);
  products = signal<IProductDto[]>([]);
  totalProducts = signal<number>(0);

  pageSize = signal<number>(5);
  pageNumber = signal<number>(1);

  sortBy = signal<string | undefined>(undefined);
  isAscending = signal<boolean>(true);

  filterOn = signal<'name' | undefined>(undefined);
  filterQuery = signal<string | undefined>(undefined);

  options = computed((): IGetAllProductsRequestParams => {
    return {
      pageSize: this.pageSize(),
      pageNumber: this.pageNumber(),
      sortBy: this.sortBy(),
      isAscending: this.isAscending(),
      filterOn: this.filterOn(),
      filterQuery: this.filterQuery(),
    };
  });

  totalPages = computed(() => {
    return Math.ceil(this.totalProducts() / this.pageSize());
  });
  pagesArray = computed(() => {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  });

  sortSelectOptions = [
    {
      name: 'Price high to low',
      value: { sortBy: 'price', isAscending: false },
    },
    {
      name: 'Price low to high',
      value: { sortBy: 'price', isAscending: true },
    },
    {
      name: 'Rating high to low',
      value: { sortBy: 'rating', isAscending: false },
    },
    {
      name: 'Rating low to high',
      value: { sortBy: 'rating', isAscending: true },
    },
  ];

  ngOnInit(): void {
    this.loadProducts(this.options());
  }

  private loadProducts(options?: IGetAllProductsRequestParams): void {
    this.productsService.getAllProducts(options).subscribe({
      next: (res) => {
        this.products.set(res.products);
        this.totalProducts.set(res.total);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  getSelectedPage(selectedPageNumber: number) {
    if (
      selectedPageNumber !== this.pageNumber() &&
      selectedPageNumber > 0 &&
      selectedPageNumber <= this.totalPages()
    ) {
      this.pageNumber.set(selectedPageNumber);
      this.loadProducts(this.options());
    }
  }

  getNextPage() {
    if (this.pageNumber() < this.totalPages()) {
      this.pageNumber.set(this.pageNumber() + 1);
      this.loadProducts(this.options());
    }
  }

  getPreviousPage() {
    if (this.pageNumber() > 1) {
      this.pageNumber.set(this.pageNumber() - 1);
      this.loadProducts(this.options());
    }
  }

  searchByName(name: string) {
    if(!name || name.trim() === '') {
      this.filterOn.set(undefined);
      this.filterQuery.set(undefined);
      this.pageNumber.set(1);
    }
    else{
      this.filterOn.set('name');
      this.filterQuery.set(name.trim() || undefined);
    }

    this.pageNumber.set(1); // Reset to first page after search
    this.loadProducts(this.options());
  }

  sortProducts(value: { sortBy: string; isAscending: boolean }) {
    this.sortBy.set(value.sortBy);
    this.isAscending.set(value.isAscending);
    this.pageNumber.set(1); // Reset to first page after sorting
    this.loadProducts(this.options());
  }

  clearSortProducts() {
    this.sortBy.set(undefined);
    this.isAscending.set(true);
    this.pageNumber.set(1); // Reset to first page after clearing sort
    this.loadProducts(this.options());
  }

  deleteProduct(id: number): void {
    this.productsService.deleteProduct(id).subscribe({
      next: () => {
        this.loadProducts(this.options());
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product deleted successfully' });
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong while deleting the product' });
        console.error(error);
      }
    });
  }
}
