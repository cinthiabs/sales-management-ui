import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Sale } from '../models/sales/sale';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
  };
  private apiUrl = `${environment.api}`;
  constructor(private http: HttpClient) { }

  postUploadExcel(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.apiUrl}/UploadExcel`, formData);
  }
  
  getAllSales():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/GetAllSales`, this.httpOptions);
  }
}
