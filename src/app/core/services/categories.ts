import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { inject } from '@angular/core/primitives/di';
import { IAddCategory, ICategoryDto, IUpdateCategory } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class Categories {
  private http = inject(HttpClient);
  private baseUrl = 'https://localhost:7076/api/categories';

  createCategory(category: IAddCategory) {
    return this.http.post<ICategoryDto>(this.baseUrl, category);
  }

  getAllCategories() {
    return this.http.get<ICategoryDto[]>(this.baseUrl);
  }

  deleteCategory(id: number) {
    return this.http.delete<ICategoryDto>(`${this.baseUrl}/${id}`);
  }

  updateCategory(id: number, updateCategory: IUpdateCategory) {
    return this.http.put<ICategoryDto>(`${this.baseUrl}/${id}`, updateCategory);
  }
}
