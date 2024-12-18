import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule} from '@angular/router'
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../types';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, ButtonModule, ReactiveFormsModule, DialogModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  loginForm: FormGroup;
  display: boolean = false;
  cartItemCount: number = 0;
  searchQuery: string = '';
  passwordType: string = 'password'; 
  // isNavVisible: boolean = false;


  ngOnInit(): void {
    this.cartService.cart$.subscribe((cart: CartItem[]) => {
      this.cartItemCount = cart.length;
    });
  }

  constructor( private fb: FormBuilder, private router: Router, public authservice: AuthService, private cartService: CartService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  
  }

  onSearch(): void {
    // Navigate to the search results page and pass the search query
    if (this.searchQuery.trim()) { 
      this.router.navigate(['/search'], { queryParams: { query: this.searchQuery } });
      console.log(this.searchQuery);
      this.searchQuery = '';
    } else {
      // Handle empty search query if needed
      console.log('Search query is empty');
    }
  }
  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }
  

  openWhatsApp() {
    const phoneNumber = '+254718285251'; 
    const message = 'Hello, I would like to know more about GigaTeam Solutions services.';
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }
  onSubmit() {
    if (this.loginForm.valid) {

      const username = this.loginForm.value.username;
      const password = this.loginForm.value.password;
      
      this.authservice.login(username, password).subscribe(
        (response) => {
          if (response) {
            // If login is successful, navigate to the admin-home page
            this.router.navigate(['/admin-home']);
          } else {
            // Handle login failure (e.g., show an error message)
            alert('Login failed: Invalid username or password');
          }
        },
        (error) => {
          // Handle error (e.g., show an error message)
          console.error('Login error:', error);
          alert('An error occurred during login. Please try again.');
        }
      );
    }
    this.display = false;
    this.loginForm.reset();
  }

  toggleLoginStatus() {
    if (this.authservice.isAuthenticated()) {
      this.authservice.logout();
      this.router.navigate(['/']);
    }
  }

  showDialog() {
    this.display = true;
  }
}
