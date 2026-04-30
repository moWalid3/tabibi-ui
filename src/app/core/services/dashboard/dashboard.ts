import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAnalyticsDashboard } from '../../models/dashboard/analytics.model';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private analyticsApiUrl = environment.analyticsApiUrl;

  getSummary(): Observable<IAnalyticsDashboard> {
    return this.http.get<IAnalyticsDashboard>(`${this.analyticsApiUrl}/api/analytics/admin-dashboard`);
  }
}
