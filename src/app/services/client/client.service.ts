import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response  } from '../../models/shared/response';
import { Client, RelClients } from '../../models/client/client';


@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }
  
  getAllClients():Observable<Response<Client>>{
    return this.http.get<Response<Client>>('/GetAllClients');
  }
  getByIdClient(id: number):Observable<Response<Client>>{
    return this.http.get<Response<Client>>(`/GetByIdClient/${id}`);
  }
  postCreateClient(client: Client):Observable<any>{
    return this.http.post<any>('/CreateClient/', client);
  }
  updateClient(client: Client, id:number):Observable<any>{
    return this.http.put<any>(`/UpdateClient/${id}`, client);
  }
  deleteClient(id: number):Observable<any>{
    return this.http.delete<any>(`/DeleteClient/${id}`);
  }
  getRelQuantity(dateIni: string, dateEnd: string, id?:number): Observable<Response<RelClients[]>>{
    return this.http.get<Response<RelClients[]>>(`/GetRelClients?dateIni=${dateIni}&dateEnd=${dateEnd}&id=${id}`);
  }
}
