import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { categories } from '../../shared/categories';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  
  categories = categories;

  isDialogVisible = false;

  // Toggle dialog visibility
  toggleDialog() {
    this.isDialogVisible = !this.isDialogVisible;
  }
 @Output() categorySelected = new EventEmitter<string>();

  selectCategory(category: any) {;
    this.categorySelected.emit(category);
    this.isDialogVisible = false;
  }
}
