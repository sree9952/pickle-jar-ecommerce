import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiResponse } from '../models/api.model';

import { environment } from '../../../environments/environment';

const TOKEN_KEY = 'pickle_admin_token_v1';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  login(email: string, pass: string): Observable<ApiResponse<{ token: string; user: any }>> {
    return this.http
      .post<ApiResponse<{ token: string; user: any }>>(`${this.apiUrl}/login`, {
        email,
        password: pass,
      })
      .pipe(
        tap((res) => {
          if (res.data?.token) {
            localStorage.setItem(TOKEN_KEY, res.data.token);
            this.isAuthenticatedSubject.next(true);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.isAuthenticatedSubject.next(false);
  }
}
