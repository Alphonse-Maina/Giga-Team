import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../types';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'shoppingCart';
  private cartSubject = new BehaviorSubject<any>(this.getCart());
  cart$ = this.cartSubject.asObservable();

  constructor() { }

  getCart() {
    const cart = localStorage.getItem(this.cartKey);
    return cart ? JSON.parse(cart) : [];
  }

  saveCart(cart: CartItem[]) {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    this.cartSubject.next(cart);
  }

  addItem(item: CartItem) {
    const cart = this.getCart();
    const existingItem = cart.find((cartItem: { id: number; }) => cartItem.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    this.saveCart(cart);
  }

  updateItemQuantity(itemId: number, quantity: number) {
    const cart = this.getCart();
    const item = cart.find((cartItem: { id: number; }) => cartItem.id === itemId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeItem(itemId);
      } else {
        this.saveCart(cart);
      }
    }
  }

  removeItem(itemId: number) {
    let cart = this.getCart();
    cart = cart.filter((cartItem: { id: number; }) => cartItem.id !== itemId);
    this.saveCart(cart);
  }

  clearCart() {
    localStorage.removeItem(this.cartKey);
    this.cartSubject.next([]);
  }

  getItemCount(): number {
    const cart = this.getCart();
    return cart.reduce((count: any, item: { quantity: any; }) => count + item.quantity, 0);
  }
}
