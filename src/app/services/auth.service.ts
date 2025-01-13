import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable ,tap, BehaviorSubject} from 'rxjs';
import { LoginCredentials, RegisterData, AuthResponse } from '../interfaces/auth';
import { User } from '../interfaces/user';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUser: User | null = null;

  constructor(private http: HttpClient) {
    this.checkAuth();
  }

  private checkAuth() {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
        this.currentUser = JSON.parse(user);
      }
    }
  }

  login(credentials: LoginCredentials): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.token && typeof localStorage !== 'undefined') {
            localStorage.setItem('token', response.token);
            // Aquí podrías hacer una llamada adicional para obtener la información del usuario si es necesario
          }
        })
      );
  }

  register(userData: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(response => {
          if (response.token && typeof localStorage !== 'undefined') {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            this.currentUser = response.user;
          }
        })
      );
  }

  isAuthenticated(): boolean {
    return typeof localStorage !== 'undefined' && !!localStorage.getItem('token');
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.currentUser = null;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

    getToken(): string | null {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  }
}