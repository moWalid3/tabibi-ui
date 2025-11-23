import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ILoginResponse, IRefreshRequest, IUserLoginDto } from '../models/auth.model';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = `${environment.apiUrl}/auth`;

  accessToken = signal<string | null>(localStorage.getItem('accessToken'));
  refreshToken = signal<string | null>(localStorage.getItem('refreshToken'));

  constructor() {
    this.accessToken.set(localStorage.getItem('accessToken'));
    this.refreshToken.set(localStorage.getItem('refreshToken'));
  }

  login(user: IUserLoginDto) {
    return this.http.post<ILoginResponse>(`${this.baseUrl}/login`, user).pipe(
      tap((res) => {
        this.updateTokens(res.accessToken, res.refreshToken);
      })
    );
  }

  refresh(refreshToken: string) {
    const payload: IRefreshRequest = { refreshToken };
    return this.http.post<ILoginResponse>(`${this.baseUrl}/refresh`, payload).pipe(
      tap((res) => {
        this.updateTokens(res.accessToken, res.refreshToken);
      })
    );
  }

  updateTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    this.accessToken.set(accessToken);
    this.refreshToken.set(refreshToken);
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.accessToken.set(null);
    this.refreshToken.set(null);
    this.router.navigate(['/login']);
  }

  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }
}
