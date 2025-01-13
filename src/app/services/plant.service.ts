import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Plant } from '../interfaces/plant';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  private apiUrl = 'http://localhost:8080/api/plants';

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

  getPlants(): Observable<Plant[]> {
    return this.http.get<Plant[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  addPlant(plant: Plant): Observable<Plant> {
    return this.http.post<Plant>(this.apiUrl, plant, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updatePlant(id: number, plant: Plant): Observable<Plant> {
    return this.http.put<Plant>(`${this.apiUrl}/${id}`, plant, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deletePlant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
}