import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IDashboardSummary } from '../../models/dashboard/dashboard.model';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getSummary(): Observable<IDashboardSummary> {
    return this.http.get<IDashboardSummary>(`${this.apiUrl}/admin/dashboard/summary`);
  }
}
