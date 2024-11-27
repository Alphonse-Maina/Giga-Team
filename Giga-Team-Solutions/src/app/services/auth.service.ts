import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://192.168.0.102:3000/api/auth';
  //private apiUrl = 'http://localhost:3000/api/auth'; // Endpoint for authentication
  
  constructor(private http: HttpClient) { }
  private loggedIn: boolean = false;

  isAuthenticated(): boolean {
    return this.loggedIn;
  }

  login(username: string, password: string): Observable<any> {
    const credentials = { username, password };
  
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // If login is successful, store the token or grant access
        localStorage.setItem('token', response.token); // Store the token for further authenticated requests
        // console.log('Access granted');
        this.loggedIn = true; // Set to true after successful login
      }),
      catchError(error => {
        // If login fails, handle the error
        console.error('Access denied:', error.message);
        return of(null); // Return a null observable to prevent breaking the flow
      })
    );
  }



  logout() {
    this.loggedIn = false; // Set to false on logout
  }
}

