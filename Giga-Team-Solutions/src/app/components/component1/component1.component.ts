import { CommonModule } from '@angular/common';
import { Component, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { categories } from '../../shared/categories';
import { ApiService } from '../../services/api.service';
import { AddCartComponent } from "../add-cart/add-cart.component";
import { Product } from '../../types';

@Component({
  selector: 'app-component1',
  standalone: true,
  imports: [PaginatorModule, CommonModule, AddCartComponent],
  templateUrl: './component1.component.html',
  styleUrl: './component1.component.scss'
})
export class Component1Component {
  @Input() categoryName!: string;
  @Input() products!: Product[];
  rowsPerCategory: number = 0;
  totalRecordsPerCategory: number = 0;
  paginatedProductsPerCategory: any [] = [];

  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categoryName']) {
      this.initializeCategories();
    }
  }
  
  
  initializeCategories(): void {
   
      const categoryProducts = this.products.filter(product => product.category === this.categoryName);
      this.rowsPerCategory = 5;  // Default rows per page
      this.totalRecordsPerCategory = categoryProducts.length;
  
      // Paginate right after filtering
      this.paginate({ first: 0, rows: this.rowsPerCategory });
    
  }
  
  paginate(event: PaginatorState): void {
    // Ensure first is not undefined, default to 0
    const first = event.first !== undefined ? event.first : 0;
    const rows = event.rows !== undefined ? event.rows : 5; // Default rows to 5 if undefined
  
    const categoryProducts = this.products.filter(product => product.category === this.categoryName);
    
    // Paginate the filtered category products
    this.paginatedProductsPerCategory = categoryProducts.slice(first, first + rows);
    // console.log(`Paginated products for category: ${categoryName}`, this.paginatedProductsPerCategory[categoryName]);
  }
  
  
  getPaginatedProducts(): any[] {
    return this.paginatedProductsPerCategory || [];
  }
  
}
