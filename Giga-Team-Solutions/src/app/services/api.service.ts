import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../types';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://192.168.0.102:3000/api';
  //private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

  
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  addProduct(product: Product): Observable<any> {
    return this.http.post(`${this.apiUrl}/products`, product);
  }

   // Method to fetch all products
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products`);
  }

  updateProduct(product: Product): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/products/${product.id}`, product);
  }

  // api.service.ts
  deleteProduct(productId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/products/${productId}`);
  }
  sendEmail(data: { name: string; email: string; message: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

}
