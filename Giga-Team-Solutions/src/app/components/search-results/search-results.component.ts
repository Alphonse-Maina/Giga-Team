import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CartItem, Product } from '../../types';
import { PricePipe } from "../../pipes/price.pipe";
import { CommonModule } from '@angular/common';
import { ProductDetailComponent } from "../product-detail/product-detail.component";
import { CartService } from '../../services/cart.service';
import { TruncateNamePipe } from "../../pipes/truncate-name.pipe";

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [PricePipe, CommonModule, TruncateNamePipe],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent {
  searchQuery: string = '';
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedproduct!: Product;
  cartItems: any[] = [];
  
  @ViewChild(ProductDetailComponent) productDetailModal!: ProductDetailComponent;


  constructor(private apiService: ApiService, private route: ActivatedRoute,  private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['query'] || ''; // Get the query parameter
      this.fetchProducts();
    });
    this.cartService.cart$.subscribe((cart: CartItem[]) => {
      this.cartItems = cart;
    });
  }

  fetchProducts(): void {
    this.apiService.getProducts().subscribe(
      (products: Product[]) => {
        this.products = products;
        this.performSearch();
      },
      error => {
        console.error('Error fetching products', error);
      }
    );
  }
  viewProductDetail(productId: number): void {
    this.router.navigate(['/product'],{ queryParams: { id: productId } });
  }

  performSearch(): void {
    if (this.searchQuery) {
      this.filteredProducts = this.products.filter(product => 
        (product.name && product.name.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
        (product.description && product.description.toLowerCase().includes(this.searchQuery.toLowerCase()))
      );
    } else {
      this.filteredProducts = this.products;
    }
  }
  openProductDetail(product: Product) {
    this.selectedproduct = product;
    console.log(this.selectedproduct);
  }

  
}
