import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://5e0b-197-248-111-39.ngrok-free.app/api/auth';
  //private apiUrl = 'http://localhost:3000/api/auth'; 
  
  constructor(private http: HttpClient) { }
  private loggedIn: boolean = false;

  isAuthenticated(): boolean {
    return this.loggedIn;
  }

  login(username: string, password: string): Observable<any> {
    const credentials = { username, password };
  
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        
        this.loggedIn = true; 
      }),
      catchError(error => {
        console.error('Access denied:', error.message);
        return of(null);
      })
    );
  }



  logout() {
    this.loggedIn = false; // Set to false on logout
  }
}

