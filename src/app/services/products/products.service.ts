import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../../models/products/products';
import { Observable } from 'rxjs';
import { Response  } from '../../models/shared/response';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }
  
  getAllProducts():Observable<Response<Product>>{
    return this.http.get<Response<Product>>('/GetAllProducts');
  }
  getByIdProduct(id: number):Observable<Response<Product>>{
    return this.http.get<Response<Product>>(`/GetByIdProduct/${id}`);
  }
  postCreateProduct(product: Product):Observable<any>{
    return this.http.post<any>('/CreateProduct/', product);
  }
  updateProduct(product: Product, id:number):Observable<any>{
    return this.http.put<any>(`/UpdateProduct/${id}`, product);
  }
  deleteProduct(id: number):Observable<any>{
    return this.http.delete<any>(`/DeleteProduct/${id}`);
  }

}
