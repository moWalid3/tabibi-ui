import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ICategoryDto } from '../../core/models/category.model';
import { Categories as CategoriesService } from '../../core/services/categories';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-categories',
  imports: [RouterLink, ButtonModule, TableModule, Toast],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
  providers: [MessageService]
})
export class Categories {
  private categoriesService = inject(CategoriesService);
  private messageService = inject(MessageService);
  categories = signal<ICategoryDto[]>([]);

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  deleteCategory(id: number): void {
    this.categoriesService.deleteCategory(id).subscribe({
      next: () => {
        this.loadCategories();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category deleted successfully' });
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something wrong with category deleting' });
        console.error(error);
      }
    });
  }
}
