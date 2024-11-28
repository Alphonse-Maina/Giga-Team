import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../types';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'https://5e0b-197-248-111-39.ngrok-free.app/api';
  //private apiUrl = 'http://localhost:3000/api';

  private headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });

  constructor(private http: HttpClient) { }

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/upload`, formData, { headers: this.headers });
  }

  addProduct(product: Product): Observable<any> {
    return this.http.post(`${this.apiUrl}/products`, product, { headers: this.headers });
  }

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products`, { headers: this.headers });
  }

  updateProduct(product: Product): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/products/${product.id}`, product, { headers: this.headers });
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/products/${productId}`, { headers: this.headers });
  }

  sendEmail(data: { name: string; email: string; message: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, data, { headers: this.headers });
  }
}
