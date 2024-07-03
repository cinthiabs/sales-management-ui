import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cost } from '../../models/costs/costs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CostsService {

  constructor(private http: HttpClient) { }

  getAllCosts():Observable<Cost[]>{
    return this.http.get<Cost[]>('/GetAllCosts');
  }
  getByIdCost(id: number):Observable<Cost>{
    return this.http.get<Cost>(`/GetByIdCost/${id}`);
  }
  postCreateCost(sale: Cost):Observable<any>{
    return this.http.post<any>('/CreateCost/', sale);
  }
  updateCost(sale: Cost):Observable<any>{
    return this.http.put<any>('/UpdateCost/', sale);
  }
  deleteCost(id: number):Observable<any>{
    return this.http.delete<any>(`/DeleteCost/${id}`);
  }
}
