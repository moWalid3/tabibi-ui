import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { inject } from '@angular/core/primitives/di';
import { IAddProduct, IGetAllProductsRequestParams, IGetAllProductsResponse, IProductDto, IProductWithCategory, IUpdateProduct } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class Products {
  private http = inject(HttpClient);
  private baseUrl = 'https://localhost:7076/api/products';

  createProduct(product: IAddProduct) {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', product.price.toString());
    formData.append('rating', product.rating.toString());
    formData.append('quantity', product.quantity.toString());
    formData.append('summary', product.summary || '');
    formData.append('description', product.description || '');
    if (product.imageFile) {
      formData.append('imageFile', product.imageFile);
    }
    formData.append('categoryId', product.categoryId.toString());

    return this.http.post<IProductDto>(this.baseUrl, formData);
  }

  getAllProducts(options?: IGetAllProductsRequestParams) {
    const params = {
      ...options,
      isAscending: options?.isAscending ?? true,
    };
    return this.http.get<IGetAllProductsResponse>(`${this.baseUrl}`, { params });
  }

  getProductById(id: number) {
    return this.http.get<IProductWithCategory>(`${this.baseUrl}/${id}`);
  }

  deleteProduct(id: number) {
    return this.http.delete<IProductDto>(`${this.baseUrl}/${id}`);
  }

  updateProduct(id: number, product: IUpdateProduct) {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', product.price.toString());
    formData.append('rating', product.rating.toString());
    formData.append('quantity', product.quantity.toString());
    formData.append('summary', product.summary || '');
    formData.append('description', product.description || '');
    formData.append('categoryId', product.categoryId.toString());
    if (product.imageFile) {
      formData.append('imageFile', product.imageFile);
    }
    return this.http.put<IProductDto>(`${this.baseUrl}/${id}`, formData);
  }
}
