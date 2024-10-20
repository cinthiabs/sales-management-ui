import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response  } from '../../models/shared/response';
import { UserProfile } from '../../models/user/profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  getAllUserProfile():Observable<Response<UserProfile>>{
    return this.http.get<Response<UserProfile>>('/GetAllUserProfile');
  }
  getByUserProfile(user: string):Observable<Response<UserProfile>>{
    return this.http.get<Response<UserProfile>>(`/GetByUsernameProfile/${user}`);
  }

  updateUserProfile(profile: Object, username: any):Observable<any>{
    return this.http.put<any>(`/UpdateUserProfile/${username}`, profile);
  }
}
