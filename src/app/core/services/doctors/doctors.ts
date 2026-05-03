import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { inject } from '@angular/core/primitives/di';
import { IDoctorDto } from '../../models/doctors/doctor.model';
import { IResponseCollection } from '../../models/common/responseCollection.model';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Doctors {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  private renderApiUrl = 'https://api-tabibi-admin-panel-1.onrender.com/api';

  getAllDoctors(params?: any) {
    return this.http.get<IResponseCollection<IDoctorDto>>(`${this.baseUrl}/admin/doctors`, {
      params: params,
    });
  }

  getDepartments() {
    return this.http.get<IResponseCollection<any>>(`${this.baseUrl}/departments`);
  }

  getCities() {
    return this.http.get<any[]>(`${this.baseUrl}/cities`);
  }

  getDoctorById(id: string) {
    return this.http.get<any>(`${this.baseUrl}/admin/doctors/${id}`);
  }

  deleteDoctor(id: string) {
    return this.http.delete(`${this.baseUrl}/admin/doctors/${id}`);
  }

  updateDoctorStatus(id: string, status: number) {
    return this.http.put(`${this.baseUrl}/admin/doctors/${id}`, { status });
  }

  getDoctorsOverview(params?: any) {
    return this.http.get<any>(`${this.renderApiUrl}/users/doctors/page/overview`, { params });
  }

  getDoctorDetails(id: string) {
    return this.http.get<any>(`${this.renderApiUrl}/users/doctors/page/details/${id}`);
  }
}
