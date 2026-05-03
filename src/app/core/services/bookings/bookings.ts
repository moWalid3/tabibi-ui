import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  private http = inject(HttpClient);
  private renderApiUrl = 'https://api-tabibi-admin-panel-1.onrender.com/api';

  getBookingsOverview(params?: any) {
    return this.http.get<any>(`${this.renderApiUrl}/bookings/page/overview`, { params });
  }

  getBookingDetails(id: string) {
    return this.http.get<any>(`${this.renderApiUrl}/bookings/page/details/${id}`);
  }
}
