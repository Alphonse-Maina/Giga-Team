import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { PricePipe } from '../../pipes/price.pipe';
import { TruncateNamePipe } from '../../pipes/truncate-name.pipe';
import { Product, CartItem } from '../../types';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-cart',
  standalone: true,
  imports: [CommonModule, RatingModule, FormsModule, ButtonModule, PricePipe, TruncateNamePipe],
  providers:[ConfirmationService],
  templateUrl: './add-cart.component.html',
  styleUrl: './add-cart.component.scss'
})
export class AddCartComponent {
  @Input() product!: Product;

  
  cartItems: any[] = [];
  constructor(private cartService: CartService, private router: Router){}

  ngOnInit(): void {
    this.cartService.cart$.subscribe((cart: CartItem[]) => {
      this.cartItems = cart;
    });
  }

  viewProductDetail(productId: number): void {
    this.router.navigate(['/product'],{ queryParams: { id: productId } });
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

  getCartItem(product: any) {
    return this.cartItems.find(item => item.id === product.id);
  }
}
