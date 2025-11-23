import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IDepartmentDto, IDepartmentPayload } from '../../models/departments/department.model';
import { IResponseCollection } from '../../models/common/responseCollection.model';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Departments {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getAllDepartments(params?: any) {
    return this.http.get<IResponseCollection<IDepartmentDto>>(`${this.baseUrl}/departments`, {
      params: params
    });
  }

  getDepartmentById(id: string) {
    return this.http.get<IDepartmentDto>(`${this.baseUrl}/departments/${id}`);
  }

  createDepartment(data: IDepartmentPayload) {
    return this.http.post(`${this.baseUrl}/departments`, data);
  }

  updateDepartment(id: string, data: IDepartmentPayload) {
    return this.http.put(`${this.baseUrl}/departments/${id}`, data);
  }

  deleteDepartment(id: string) {
    return this.http.delete(`${this.baseUrl}/departments/${id}`);
  }

  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('File', file);
    return this.http.post<{ imageUrl: string }>(`${this.baseUrl}/images/upload`, formData);
  }
}
