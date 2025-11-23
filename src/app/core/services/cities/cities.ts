import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICityDto, ICityPayload } from '../../models/cities/city.model';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Cities {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllCities(): Observable<ICityDto[]> {
    return this.http.get<ICityDto[]>(`${this.apiUrl}/cities`);
  }

  createCity(payload: ICityPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/cities`, payload);
  }

  updateCity(id: string, payload: ICityPayload): Observable<any> {
    return this.http.put(`${this.apiUrl}/cities/${id}`, payload);
  }

  deleteCity(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cities/${id}`);
  }
}
