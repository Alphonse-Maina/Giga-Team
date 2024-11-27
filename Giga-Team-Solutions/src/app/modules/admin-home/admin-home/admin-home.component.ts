import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { categories } from '../../../shared/categories';
import { ApiService } from '../../../services/api.service';
import { PaginatorModule } from 'primeng/paginator';
import { ProductComponent } from "../../../components/product/product.component";
import { PaginatorState, Product } from '../../../types';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [FormsModule, CommonModule, ProductComponent, PaginatorModule],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.scss'
})
export class AdminHomeComponent implements OnInit {


  isDialogOpen = false;
  categories = categories;
  selectedImage: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  productData: any = {};
  bestselling: boolean = false;
  onoffer: boolean = false;
  oldprice : number = 0;
  products: any[] = [];
  paginatedProducts: any[]=[];
  totalRecords: number = 0;
  rows: number = 20;
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
    const rows = event.rows !== undefined ? event.rows : 5; // Default rows to 10 if undefined
  
    const categoryProducts = this.products.filter(product => product.category === categoryName);
    
    // Paginate the filtered category products
    this.paginatedProductsPerCategory[categoryName] = categoryProducts.slice(first, first + rows);
    // console.log(`Paginated products for category: ${categoryName}`, this.paginatedProductsPerCategory[categoryName]);
  }
  
  
  getPaginatedProducts(categoryName: string): any[] {
    return this.paginatedProductsPerCategory[categoryName] || [];
  }
  

  openDialog() {
    this.isDialogOpen = true;
  }

  closeDialog() {
    this.isDialogOpen = false;
  }

  triggerFileInput() {
    document.getElementById('image')?.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(productForm: any) {
    if(productForm.valid){ 
      if(this.selectedFile){
        this.apiService.uploadImage(this.selectedFile).subscribe(response =>{
            // Handle the response, e.g., get the image URL
            const imageUrl = response.imageUrl;  // Assuming the backend returns the image URL

            this.apiService.getProducts().subscribe(existingProducts => {
            // Calculate the new ID
              const maxId = Math.max(...existingProducts.map(p => p.id), 0);
              const newId = maxId + 1;
        

              // Now include the image URL in your product data and submit it
              this.productData = {
                id: newId,
                name: productForm.value.name,
                imageUrl: imageUrl,
                price: productForm.value.price,
                oldprice: this.oldprice,
                category: productForm.value.category,
                onoffer: this.onoffer,
                bestselling: this.bestselling,
                description: productForm.value.description,
              };
                // Log the data to the console (or handle it as needed)
                //console.log ('Product Data:', this.productData);
          
              this.apiService.addProduct(this.productData).subscribe(() => {
                alert('added succesfully');
              });
            
              // Reset the form and clear the selected image
              this.selectedImage = null;
              productForm.resetForm();

              // Close the dialog after submission
              this.closeDialog();

              // Refresh the page with new data 
              this.fetchProducts();
            });
        });
      }
    }
  }

  editProduct(updatedProduct: Product) {
    // Call the API to update the product
    this.apiService.updateProduct(updatedProduct).subscribe((response: any) => {
      // Handle the response after the product is updated
      console.log('Product updated successfully', response);
      // Optionally, refresh the products list after deletion
      this.fetchProducts();

      // Update the local product data if needed
      const index = this.products.findIndex(p => p.id === updatedProduct.id);
      if (index !== -1) {
        this.products[index] = updatedProduct;
      }
    }, (error: any) => {
      console.error('Error updating product', error);
    });
  }

  toggleDeletePopup(product: Product){
    if(!product.id){
      return;
    }
    this.deleteProduct(product.id);
  }
    // admin-home.component.ts
  deleteProduct(productId: number): void {
    this.apiService.deleteProduct(productId).subscribe({
      next: () => {
        console.log(`Product with ID ${productId} deleted successfully.`);
        // Optionally, refresh the products list after deletion
        this.fetchProducts();
      },
      error: (error: any) => {
        console.error('Error deleting product:', error);
      }
    });
  }

}
