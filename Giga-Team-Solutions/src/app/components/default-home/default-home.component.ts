import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ProductComponent } from '../product/product.component';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { AddCartComponent } from '../add-cart/add-cart.component';
import { categories } from '../../shared/categories';

@Component({
  selector: 'app-default-home',
  standalone: true,
  imports: [CommonModule, PaginatorModule, AddCartComponent],
  templateUrl: './default-home.component.html',
  styleUrl: './default-home.component.scss'
})
export class DefaultHomeComponent implements OnInit {

  categories = categories;
  products: any[] = [];
  rowsPerCategory: { [key: string]: number } = {};
  totalRecordsPerCategory: { [key: string]: number } = {};
  paginatedProductsPerCategory: { [key: string]: any[] } = {};

  constructor(private apiService: ApiService) {}

  
  ngOnInit(): void {
    this.fetchProducts();
  }
  
  fetchProducts(): void {
    this.apiService.getProducts().subscribe((data: any[]) => {
      this.products = data;
      // console.log('Fetched products:', this.products); // Ensure this logs the correct data
      this.initializeCategories();
    });
  }
  
  initializeCategories(): void {
    this.categories.forEach(category => {
      const categoryProducts = this.products.filter(product => product.category === category.name);
      this.rowsPerCategory[category.name] = 5;  // Default rows per page
      this.totalRecordsPerCategory[category.name] = categoryProducts.length;
  
      // Paginate right after filtering
      this.paginate({ first: 0, rows: this.rowsPerCategory[category.name] }, category.name);
    });
  }
  
  paginate(event: PaginatorState, categoryName: string): void {
    // Ensure first is not undefined, default to 0
    const first = event.first !== undefined ? event.first : 0;
    const rows = event.rows !== undefined ? event.rows : 5; // Default rows to 5 if undefined
  
    const categoryProducts = this.products.filter(product => product.category === categoryName);
    
    // Paginate the filtered category products
    this.paginatedProductsPerCategory[categoryName] = categoryProducts.slice(first, first + rows);
    // console.log(`Paginated products for category: ${categoryName}`, this.paginatedProductsPerCategory[categoryName]);
  }
  
  
  getPaginatedProducts(categoryName: string): any[] {
    return this.paginatedProductsPerCategory[categoryName] || [];
  }
  

}
