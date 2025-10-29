import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { inject } from '@angular/core/primitives/di';
import { IPatientDto } from '../../models/patients/patient.model';
import { IResponseCollection } from '../../models/common/responseCollection.model';

@Injectable({
  providedIn: 'root',
})
export class Patients {
  private http = inject(HttpClient);
  private baseUrl = 'https://tabibi.runasp.net/patients';

  getAllPatients() {
    return this.http.get<IResponseCollection<IPatientDto>>(this.baseUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
  }
}
