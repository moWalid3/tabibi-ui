import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { inject } from '@angular/core/primitives/di';
import { IPatientDto } from '../../models/patients/patient.model';
import { IResponseCollection } from '../../models/common/responseCollection.model';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Patients {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  private renderApiUrl = 'https://api-tabibi-admin-panel-1.onrender.com/api';

  getAllPatients(params?: any) {
    return this.http.get<IResponseCollection<IPatientDto>>(`${this.baseUrl}/admin/patients`, {
      params: params
    });
  }

  getCities() {
    return this.http.get<any[]>(`${this.baseUrl}/cities`);
  }

  deletePatient(id: string) {
    return this.http.delete(`${this.baseUrl}/admin/patients/${id}`);
  }

  getPatientsOverview(params?: any) {
    return this.http.get<any>(`${this.renderApiUrl}/users/patients/page/overview`, { params });
  }

  getPatientDetails(id: string) {
    return this.http.get<any>(`${this.renderApiUrl}/users/patients/page/details/${id}`);
  }
}
