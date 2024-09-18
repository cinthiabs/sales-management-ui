import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {}

  checkTokenExpiration() {
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    if (tokenExpiration) {
      const expirationDate = new Date(tokenExpiration);
      const currentDate = new Date();
      if (currentDate >= expirationDate) {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiration');
        this.router.navigate(['/login']);
      }
    }
  }
}