import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Authentication, AuthenticationResponse } from '../../models/user/authentication';
import { Response  } from '../../models/shared/response';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  postAuthentication(authentication: Authentication): Observable<Response<AuthenticationResponse>> {
    return this.http.post<Response<AuthenticationResponse>>('/Authentication', authentication);
  }
  postCreateUser(authentication: Authentication): Observable<Response<boolean>> {
    return this.http.post<Response<boolean>>('/CreateUser', authentication);
  }
}
