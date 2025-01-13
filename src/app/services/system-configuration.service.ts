import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SystemConfiguration } from '../interfaces/SystemConfiguration';

@Injectable({
  providedIn: 'root'
})
export class SystemConfigurationService {
  private apiUrl = 'http://localhost:8080/api/system-configurations';

  constructor(private http: HttpClient) {}

  getConfigurations(): Observable<SystemConfiguration[]> {
    return this.http.get<SystemConfiguration[]>(this.apiUrl);
  }

  updateConfiguration(id: number, config: SystemConfiguration): Observable<SystemConfiguration> {
    return this.http.put<SystemConfiguration>(`${this.apiUrl}/${id}`, config);
  }
}