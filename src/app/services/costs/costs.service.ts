import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cost, RelCostPrice } from '../../models/costs/costs';
import { Observable } from 'rxjs';
import { Response  } from '../../models/shared/response';

@Injectable({
  providedIn: 'root'
})
export class CostsService {

  constructor(private http: HttpClient) { }

  getAllCosts():Observable<Response<Cost>>{
    return this.http.get<Response<Cost>>('/GetAllCosts');
  }
  getByIdCost(id: number):Observable<Response<Cost>>{
    return this.http.get<Response<Cost>>(`/GetByIdCost/${id}`);
  }
  postCreateCost(cost: Cost):Observable<any>{
    return this.http.post<any>('/CreateCost/', cost);
  }
  updateCost(cost: Cost, id:number):Observable<any>{
    return this.http.put<any>(`/UpdateCost/${id}`, cost);
  }
  deleteCost(id: number):Observable<any>{
    return this.http.delete<any>(`/DeleteCost/${id}`);
  }
  getRelCostPrice(dateIni: string, dateEnd: string): Observable<RelCostPrice[]>{
    return this.http.get<RelCostPrice[]>(`/GetRelCostPrice?dateIni=${dateIni}&dateEnd=${dateEnd}`);
  }

}
