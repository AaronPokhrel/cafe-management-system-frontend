import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  getDetails() {
    const url = `${this.apiUrl}/dashboard/details`;
    return this.httpClient.get(url);
  }
}
