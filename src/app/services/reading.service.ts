import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Reading } from '../interfaces/reading';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReadingService {
  private apiUrl = 'http://localhost:8080/api/readings';

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

  getReadings(): Observable<Reading[]> {
    return this.http.get<Reading[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  addReading(reading: Reading): Observable<Reading> {
    return this.http.post<Reading>(this.apiUrl, reading, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateReading(id: number, reading: Reading): Observable<Reading> {
    return this.http.put<Reading>(`${this.apiUrl}/${id}`, reading, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteReading(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
}