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
  getAllSales():Observable<Sale[]>{
    return this.http.get<Sale[]>(`${this.apiUrl}/GetAllSales`, this.httpOptions);
  }
  getByIdSale(id: number):Observable<Sale>{
    return this.http.get<Sale>(`${this.apiUrl}/GetByIdSale/${id}`, this.httpOptions);
  }
  postCreateSale(sale: Sale):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/CreateSale/`, sale, this.httpOptions);
  }
  updateSale(sale: Sale):Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/UpdateSale/`, sale, this.httpOptions);
  }
  deleteSale(id: number):Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/DeleteSale/${id}`, this.httpOptions);
  }

}
