import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RelQuantitySale, Sale } from '../../models/sales/sale';
import { Response  } from '../../models/shared/response';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(private http: HttpClient) { }

  getAllSales():Observable<Response<Sale>>{
    return this.http.get<Response<Sale>>('/GetAllSales');
  }
  getByIdSale(id: number):Observable<Response<Sale>>{
    return this.http.get<Response<Sale>>(`/GetByIdSale/${id}`);
  }
  postCreateSale(sale: Sale):Observable<any>{
    return this.http.post<any>('/CreateSale/', sale);
  }
  updateSale(sale: Sale, id: number):Observable<any>{
    return this.http.put<any>(`/UpdateSale/${id}`, sale);
  }
  deleteSale(id: number):Observable<any>{
    return this.http.delete<any>(`/DeleteSale/${id}`);
  }
  getRelQuantity(dateIni: string, dateEnd: string): Observable<RelQuantitySale[]>{
    return this.http.get<RelQuantitySale[]>(`/GetRelQuantity?dateIni=${dateIni}&dateEnd=${dateEnd}`);
  }

}
