import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CartItem, Product } from '../types';
import { PricePipe } from "../pipes/price.pipe";
import { ProductDetailComponent } from '../components/product-detail/product-detail.component';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PricePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  allProducts: Product[] = [];
  offerProducts: Product[] = [];
  bestSellingProducts: Product[] = [];
  maxVisibleOffers = 5;
  maxVisibleBestSelling = 5;
  selectedproduct!: Product;
  cartItems: any[] = [];
  
  @ViewChild(ProductDetailComponent) productDetailModal!: ProductDetailComponent;

  heroImages = [
    { src: '../../../public/hero/fence.png', alt: 'Hero 1' },
    { src: '../../../public/hero/networkingSwitch.jpg', alt: 'Hero 2' },
    { src: '../../../public/hero/4K-Cameras.webp', alt: 'Hero 3' },
    { src: '../../../public/hero/autogate.jpg', alt: 'Hero 4' }
  ];

  currentSlideIndex = 0;

  clients = [
    { image: '../../../public/clients/logoKRA.webp', name: 'Kenya Revenue Authority' },
    { image: '../../../public/clients/RGC-WHITE-2.png', name: 'Rolling Cargo' },
    { image: '../../../public/clients/go-invest-m.webp', name: 'GoInvest Property Consultants' },
    { image: '../../../public/clients/Wamae-Allen-LLP-Official-Logo.png', name: 'Wamae & Allen Advocates' },
    { image: '../../../public/clients/Konvergenz-Official-Logo.png', name: 'Konvergenz Solutions' },
    { image: '../../../public/clients/andmore.jpg', name: 'And More ...' }
  ];


  constructor(private apiService: ApiService, private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.fetchProducts();
    setInterval(() => this.nextSlide(), 5000);
    this.cartService.cart$.subscribe((cart: CartItem[]) => {
      this.cartItems = cart;
    });
  }

  fetchProducts(): void {
    this.apiService.getProducts().subscribe((data: Product[]) => {
      this.allProducts = data;
      this.offerProducts = this.allProducts.filter(product => product.onoffer);
      this.bestSellingProducts = this.allProducts.filter(product => product.bestselling);
    });
  }
  viewProductDetail(productId: number): void {
    this.router.navigate(['/product'],{ queryParams: { id: productId } });
  }

  nextSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.heroImages.length;
  }
  
}
