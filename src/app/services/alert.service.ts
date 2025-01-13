import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Alert } from '../interfaces/alert';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private apiUrl = 'http://localhost:8080/api/alerts';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }

  getAlerts(): Observable<Alert[]> {
    return this.http.get<Alert[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  addAlert(alert: Alert): Observable<Alert> {
    return this.http.post<Alert>(this.apiUrl, alert, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateAlert(id: number, alert: Alert): Observable<Alert> {
    return this.http.put<Alert>(`${this.apiUrl}/${id}`, alert, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteAlert(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
}