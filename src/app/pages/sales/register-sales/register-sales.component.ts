import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { Table, TableModule } from 'primeng/table';
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
import { MessagesService } from '../../../services/shared/messages.service';
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
  providers: [MessageService, MessagesService],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterSalesComponent implements OnInit {
  @ViewChild('dt') dataTable!: Table;
  
  sales: Sale[] = [];
  selectedSales: any[] = [];
  loadingTable = false;
  messageTable = 'Nenhum dado encontrado';

  constructor(private salesService: SalesService,
    public handlers: RegisterHandlers,
    private titleService: Title,
    private messagesService: MessagesService
  ){
    this.titleService.setTitle('Register Sales');
  }

  ngOnInit() {
    this.getallSale()
  }

  filterGlobal(event: any){
    const filterValue = event.target.value.trim().toLowerCase();
    this.dataTable.filterGlobal(filterValue, 'contains');
  }

  getallSale(){
    this.salesService.getAllSales().subscribe({
      next:(response) => {
        this.sales = response.flat()
      },
      error: (error) => {
        this.messageTable = 'Nenhum dado encontrado';
      }
    })
  }

  deleteSale(id: number) { 
    this.loadingTable = true;
    this.salesService.deleteSale(id).subscribe({
      next:(response) => {
        if(response.status === 200){
          this.messagesService.showSuccessToast('Venda excluida com sucesso!')
          this.loadingTable = false;
          console.log(response)
        }
      },
      error: (error) => {
        const errorMessage = error?.error ?? 'Ocorreu um erro durante a operação!';
        this.messagesService.showErrorToast(errorMessage)
        this.loadingTable = false;
      }
      
    })
  }

  editSale(sale: Sale) { 
    this.salesService.updateSale(sale).subscribe({
      next:() => {
        this.messagesService.showSuccessToast('Venda editada com sucesso!')
        this.loadingTable = false;

      },
      error: (error) => {
        const errorMessage = error?.error ?? 'Ocorreu um erro durante a operação!';
        this.messagesService.showErrorToast(errorMessage)
        this.loadingTable = false;
      }
    })
  }

  openCreate() {
    console.log('Nova sale'); 
  }


}
