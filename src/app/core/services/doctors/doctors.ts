import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { inject } from '@angular/core/primitives/di';
import { IDoctorDto } from '../../models/doctors/doctor.model';
import { IResponseCollection } from '../../models/common/responseCollection.model';

@Injectable({
  providedIn: 'root',
})
export class Doctors {
  private http = inject(HttpClient);
  private baseUrl = 'https://tabibi.runasp.net/doctors';

  getAllDoctors() {
    return this.http.get<IResponseCollection<IDoctorDto>>(this.baseUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
  }
}
