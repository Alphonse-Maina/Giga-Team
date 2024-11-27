import { Product } from './../types';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { Component1Component } from '../components/component1/component1.component';
import { DefaultHomeComponent } from '../components/default-home/default-home.component';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, DefaultHomeComponent, Component1Component, SidebarComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {

  constructor(private apiService: ApiService) {}
  ngOnInit(): void {
    this.fetchProducts();
  }
    products: Product[] = []; 
    selectedCategory: string = '';
    isSidebarVisible = false; 

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
  
  onCategorySelected(category: string) {
    this.selectedCategory = category;
  }

  fetchProducts(): void {
    this.apiService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
    });
  }

 
}
