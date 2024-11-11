import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductTotalCostsResponse } from '../../models/product-cost/product-cost-response';
import { ProductTotalCostRequest } from '../../models/product-cost/product-cost';
import { Observable } from 'rxjs';
import { Response  } from '../../models/shared/response';

@Injectable({
  providedIn: 'root'
})
export class ProductCostService {

  constructor(private http: HttpClient) { }

  getAllProductCost():Observable<Response<ProductTotalCostsResponse>>{
    return this.http.get<Response<ProductTotalCostsResponse>>('/GetAllProductCost');
  }
  getByIdProductCost(id: number):Observable<Response<ProductTotalCostsResponse>>{
    return this.http.get<Response<ProductTotalCostsResponse>>(`/GetProductCostById/${id}`);
  }
  postCreateProductCost(product: ProductTotalCostRequest):Observable<Response<ProductTotalCostsResponse>>{
    return this.http.post<Response<ProductTotalCostsResponse>>('/CreateProductCost/', product);
  }
  updateProductCost(product: ProductTotalCostRequest, id:number):Observable<Response<ProductTotalCostsResponse>>{
    return this.http.put<Response<ProductTotalCostsResponse>>(`/UpdateProductCost/${id}`, product);
  }
}