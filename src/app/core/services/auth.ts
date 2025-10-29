import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ILoginResponse, IUserLoginDto } from '../models/auth.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private baseUrl = 'https://tabibi.runasp.net/auth';

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
  }
}
