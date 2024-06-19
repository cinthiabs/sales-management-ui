import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sale } from '../models/sales/sale';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(private http: HttpClient) { }

  postUploadExcel(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>('/UploadExcel', formData);
  }
  getAllSales():Observable<Sale[]>{
    return this.http.get<Sale[]>('/GetAllSales');
  }
  getByIdSale(id: number):Observable<Sale>{
    return this.http.get<Sale>(`/GetByIdSale/${id}`);
  }
  postCreateSale(sale: Sale):Observable<any>{
    return this.http.post<any>('/CreateSale/', sale);
  }
  updateSale(sale: Sale):Observable<any>{
    return this.http.put<any>('/UpdateSale/', sale);
  }
  deleteSale(id: number):Observable<any>{
    return this.http.delete<any>(`/DeleteSale/${id}`);
  }

}
