import { CartItem } from './../../types';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '../../types';
import { PricePipe } from "../../pipes/price.pipe";
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [PricePipe, CommonModule, ButtonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  product!: Product;
  CartItem: any[] = [];
  relatedProducts: any[] = [];
  products: Product[] = []; 
  productId: number = 0;


  constructor(private cartService: CartService, private apiService: ApiService, private route: ActivatedRoute, private router: Router){}
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.productId = params['id'] || ''; 
    });
    this.fetchProducts();
    this.uploadcart();    
  }

  fetchProducts(): void {
    const currentId = this.productId;
    this.apiService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
      this.product = this.products.find(
        (p) =>  p.id == currentId
      )!;
      this.loadRelatedProducts();
    });
  }

  viewProductDetail(productId: number): void {
    console.log(productId);
    this.router.navigate(['/product'],{ queryParams: { id: productId } }).then(() => {
      window.location.reload();
    });
  }

  uploadcart() {
    this.cartService.cart$.subscribe((cart: CartItem[]) => {
      this.CartItem = cart;
    });
  }

  loadRelatedProducts(): void {
    const currentCategory = this.product.category;
    this.relatedProducts = this.products.filter(
      (p) => p.category === currentCategory && p.id !== this.product?.id
    );
  }


  getCartItem(product: any) {
    return this.CartItem.find(item => item.id === product.id);
  }
  addToCart(product: any) {
    this.cartService.addItem(product);
  }

  incrementQuantity(item: CartItem) {
    this.cartService.updateItemQuantity(item.id, item.quantity + 1);
  }

  decrementQuantity(item: CartItem) {
    this.cartService.updateItemQuantity(item.id, item.quantity - 1);
  }
  openWhatsApp() {
    const cartItem = this.getCartItem(this.product);
    let quantity = cartItem ? cartItem.quantity : 1;
    const phoneNumber = '+254752406708';
    const message = `Hello, I would like to buy ${quantity} of ${this.product.name}.`;
  
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }
  
}
