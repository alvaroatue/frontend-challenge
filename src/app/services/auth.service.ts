import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable ,tap, BehaviorSubject, catchError, throwError} from 'rxjs';
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
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage: string;
    
    if (error.status === 409) {
      errorMessage = 'El email o nombre de usuario ya está registrado';
    } else if (error.status === 400) {
      errorMessage = 'Datos inválidos. Por favor, verifique la información.';
    } else {
      errorMessage = 'Error al procesar la solicitud. Por favor, intente nuevamente.';
    }

    return throwError(() => new Error(errorMessage));
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