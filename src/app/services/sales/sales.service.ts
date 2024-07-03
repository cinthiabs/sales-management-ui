import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RelQuantitySale, Sale } from '../../models/sales/sale';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(private http: HttpClient) { }

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
  getRelQuantity(dateIni: string, dateEnd: string): Observable<RelQuantitySale[]>{
    return this.http.get<RelQuantitySale[]>(`/GetRelQuantity?dateIni=${dateIni}&dateEnd=${dateEnd}`);
  }

}
