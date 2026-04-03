import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = 'https://backend.kerigma-eventos.online/api/v1';
  // private apiUrl = 'http://localhost:5290/api/v1';

  constructor(private http: HttpClient) {}

  login(email: string, senha: string) {

    return this.http.post<any>(`${this.apiUrl}/login`, { email, password: senha })
      .pipe(
        tap(res => {
          localStorage.setItem('token', res.token);
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLogged() {
    return !!this.getToken();
  }
}
