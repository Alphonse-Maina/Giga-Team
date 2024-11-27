import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../types';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss'
})
export class EditProductComponent {
  @Input() isOpen = false;  // Control the visibility of the dialog
  @Input() product: any;    // Product data to edit
  @Output() close = new EventEmitter<void>();  // Emit when the dialog is closed
  @Output() productUpdated = new EventEmitter<any>(); // Event to emit the updated product
  
  editedProduct: any = {};
  oldPrice: number = 0;


  ngOnInit() {
    this.editedProduct = { ...this.product }; // Initialize edited product
    this.oldPrice = this.product.price; // Set initial old price
  }

  saveChanges() {
    const newPrice = this.editedProduct.price;
    const priceDifference = this.oldPrice - newPrice;

    // Check if the new price is at least 5% less than the old price
    if (priceDifference / this.oldPrice >= 0.05) {
      this.editedProduct.onoffer = true;
    } else {
      this.editedProduct.onoffer = false;
    }

    // Emit the updated product data
    this.productUpdated.emit(this.editedProduct);
    this.closeDialog(); // Close the dialog after saving
  }

 
  closeDialog() {
    this.close.emit();
  }
}
