import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { PricePipe } from '../../pipes/price.pipe';
import { TruncateNamePipe } from '../../pipes/truncate-name.pipe';
import { Product } from '../../types';
import { CommonModule } from '@angular/common';
import { EditProductComponent } from "../edit-product/edit-product.component";

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [RatingModule, FormsModule, ButtonModule, ConfirmPopupModule, ToastModule, PricePipe, TruncateNamePipe, CommonModule, EditProductComponent],
  providers:[ConfirmationService],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {
imageUrl: string = '';
isEditDialogOpen = false;
  editedProduct: any;

  constructor(private confirmationService: ConfirmationService){}

 @ViewChild('deleteButton') deleteButton: any;

@Input() product!: Product;
@Output() productUpdated = new EventEmitter<any>();
@Output() delete: EventEmitter<any> = new EventEmitter<any>();

setImageUrl() {
  const baseUrl =  "../../../..";
  this.imageUrl = this.product.image;
  // console.log(this.imageUrl);
}

  openEditDialog() {
    this.isEditDialogOpen = true;
  }

  closeEditDialog() {
    this.isEditDialogOpen = false;
  }

  saveProduct(updatedProduct: any) {
    //this.product = updatedProduct;
    this.productUpdated.emit(updatedProduct);
    this.closeEditDialog();
  }
  confirmDelete(){
    this.confirmationService.confirm({
      target: this.deleteButton.nativeElement,
      message: 'Are you sure you want to delete this product?',
      accept:()=>{
        this.deleteProduct();
      },
    });
  }

  deleteProduct(){
    this.delete.emit(this.product);
  }

  ngOnInit() {
    if (this.product) {
      this.setImageUrl();
    }
  }
  
}
