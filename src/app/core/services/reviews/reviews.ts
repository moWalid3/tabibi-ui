import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  private http = inject(HttpClient);
  private renderApiUrl = 'https://api-tabibi-admin-panel-1.onrender.com/api';

  getReviewsOverview(params?: any) {
    return this.http.get<any>(`${this.renderApiUrl}/reviews/page/overview`, { params });
  }
}
