import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';

import { Sale } from '../../../models/sales/sale';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-register-sales',
  standalone: true,
  imports: [ButtonModule,
    FileUploadModule,
    TableModule,
    TagModule,
    ToastModule, 
    RatingModule, 
    FormsModule,
    CommonModule,
    ToolbarModule],
  templateUrl: './register-sales.component.html',
  styleUrl: './register-sales.component.scss'
})
export class RegisterSalesComponent {
  sales: Sale[] = [];
  selectedSales: any[] = [];

  ngOnInit() {
    
  }

  deleteSale(sale: Sale) { 
  }

  editSale(sale: Sale) { 

  }

  getSeverity(status: string) {
    return status === 'INSTOCK' ? 'success' : 'danger';
  }

  openNew() {
    console.log('Nova sale'); 
  }

  deleteSelectedSales() {
    console.log('Sales selecionadas deletadas'); 
  }
}
