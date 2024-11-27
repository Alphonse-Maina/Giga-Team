import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PricePipe } from "../../pipes/price.pipe";
import { CartItem } from '../../types';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, PricePipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  cartItems: CartItem[] = [];

  constructor(private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cartItems = cart;
    });
  }

  incrementQuantity(item: CartItem) {
    this.cartService.updateItemQuantity(item.id, item.quantity + 1);
  }

  decrementQuantity(item: CartItem) {
    if (item.quantity > 1) {
      this.cartService.updateItemQuantity(item.id, item.quantity - 1);
    }
  }

  removeItem(index: number) {
    this.cartService.removeItem(index);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  buyViaWhatsApp() {
    const itemsDetails = this.cartItems.map(item => `${item.name} (x${item.quantity}): ${item.price * item.quantity}`).join('\n');
    const message = `I'd love to purchase these items:\n\n${itemsDetails}\n\nGrand Total: ${this.getTotalPrice()}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/254752406708?text=${encodedMessage}`);
  }

  goToShop() {
    this.router.navigate(['/shop']);
  }
}
