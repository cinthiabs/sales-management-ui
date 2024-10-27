import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response  } from '../../models/shared/response';
import { ZipCode } from '../../models/zipcode/zipcode';

@Injectable({
  providedIn: 'root'
})
export class ZipcodeService {

  constructor(private http: HttpClient) { }

  getZipCode(zipcode: string):Observable<Response<ZipCode>>{
    return this.http.get<Response<ZipCode>>(`/GetZipCode/${zipcode}`);
  }


}
