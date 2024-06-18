import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';

import { Sale } from '../../../models/sales/sale';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SalesService } from '../../../services/sales.service';
import { MessageService } from 'primeng/api';
import { RegisterHandlers } from './register-handlers';
import { Title } from '@angular/platform-browser';
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
    ToolbarModule,
    DialogModule,
    ConfirmDialogModule,
    DropdownModule,
    InputTextModule],
  templateUrl: './register-sales.component.html',
  styleUrl: './register-sales.component.scss',
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterSalesComponent implements OnInit {
  sales: Sale[] = [];
  selectedSales: any[] = [];

  constructor(private salesService: SalesService,
    public handlers: RegisterHandlers,
    private titleService: Title
  ){
    this.titleService.setTitle('Register Sales');
  }

  ngOnInit() {
    this.getallSale()
     this.sales = this.handlers.getSale();
  }

  getallSale(){
    this.salesService.getAllSales().subscribe({
      next:(response: any) => {
        console.log(response)
      }
    })
  }

  deleteSale(id: number) { 
    this.salesService.deleteSale(id).subscribe({
      next:(response: any) => {
        console.log(response)
      }
    })
  }

  editSale(sale: Sale) { 
    this.salesService.updateSale(sale).subscribe({
      next:(response: any) => {
        console.log(response)
      }
    })
  }

  openCreate() {
    console.log('Nova sale'); 
  }


}
