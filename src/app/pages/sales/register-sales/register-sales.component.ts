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
import { FormGroup, FormBuilder, FormsModule , ReactiveFormsModule, Validators} from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';

import { Sale } from '../../../models/sales/sale';
import { CommonModule } from '@angular/common';
import { SalesService } from '../../../services/sales/sales.service';
import { MessageService } from 'primeng/api';
import { RegisterHandlers } from './register-handlers';
import { Title } from '@angular/platform-browser';
import { NotificationService } from '../../../services/shared/messages/notification.service';
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
    ReactiveFormsModule,
    CommonModule,
    ToolbarModule,
    DialogModule,
    ConfirmDialogModule,
    DropdownModule,
    CalendarModule,
    InputTextModule],
  templateUrl: './register-sales.component.html',
  styleUrl: './register-sales.component.scss',
  providers: [MessageService, NotificationService],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterSalesComponent implements OnInit {
  @ViewChild('dt') dataTable!: Table;
  
  sales: Sale[] = [];
  selectedSales: any[] = [];
  loadingTable = false;
  loadingButton = false;
  messageTable = 'No data found';
  isEditMode: boolean = false;
  sale! : Sale;
  saleId: number = 0;

  createForm: FormGroup = this.fb.group({
    dateSale:['',Validators.required],
    nameProduct: ['', Validators.required],
    details: [''],
    quantity: ['',Validators.required],
    paySelect: [''],
    price: ['',Validators.required]
  })

  constructor(
    private fb: FormBuilder,
    private salesService: SalesService,
    public handlers: RegisterHandlers,
    private titleService: Title,
    private notificationService: NotificationService
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
      error: () => {
        this.messageTable = 'No data found';
      }
    })
  }

  deleteSale(id: number) { 
    this.loadingTable = true;
    this.salesService.deleteSale(id).subscribe({
      next:() => {
          this.notificationService.showSuccessToast('Sale successfully deleted!')
          this.loadingTable = false;
          this.getallSale()
      },
      error: (error) => {
        const errorMessage = error?.error ?? 'An error has occurred during the operation.';
        this.notificationService.showErrorToast(errorMessage)
        this.loadingTable = false;
      }
      
    })
  }

  dialogEdit(sale: Sale){
    this.isEditMode = true;
    this.handlers.headerDialog = 'Edit Sale'
    this.handlers.handleInsertDialog()
    if(!!sale.id){
      this.saleId = sale.id
    }

    const payValue = this.handlers.situation.find(s => s.value === sale.pay);
    this.createForm.patchValue({
      dateSale: new Date (sale.dateSale),
      nameProduct: sale.name,
      details: sale.details,
      quantity: sale.quantity,
      paySelect: payValue,
      price: sale.price,
    });

  }

  editSale(form: FormGroup) { 
    this.loadingButton = true;
    this.sale = {
      id: this.saleId,
      name: form.get('nameProduct')?.value,
      dateSale: new Date(form.get('dateSale')?.value).toISOString().split('T')[0],
      details: form.get('details')?.value,
      quantity: form.get('quantity')?.value,
      pay: form.get('paySelect')?.value.value, 
      price: form.get('price')?.value
    };
    this.salesService.updateSale(this.sale).subscribe({
      next:() => {
        this.notificationService.showSuccessToast('Sale successfully updated!')
        this.handlers.visibleCreate = false;
        this.loadingButton = false;
        this.getallSale()
      },
      error: (error) => {
        const errorMessage = error?.error ?? 'An error has occurred during the operation.';
        this.notificationService.showErrorToast(errorMessage)
        this.loadingButton = false;
      }
    })

  }

  
  CreateOrEdit(form: FormGroup) {
    if (this.isEditMode) {
      this.editSale(form);
    } else {
      this.saveNewSale(form);
    }
  }

  saveNewSale(form: FormGroup){
    this.loadingButton = true;
    this.sale = {
      name: form.get('nameProduct')?.value,
      dateSale: new Date(form.get('dateSale')?.value).toISOString().split('T')[0],
      details: form.get('details')?.value,
      quantity: form.get('quantity')?.value,
      pay: form.get('paySelect')?.value.value, 
      price: form.get('price')?.value,
    };
    this.salesService.postCreateSale(this.sale).subscribe({
      next:() => {
        this.notificationService.showSuccessToast('Sale created successfully!')
        this.handlers.visibleCreate = false;
        this.loadingButton = false;
        this.getallSale()

      },
      error: (error) => {
        const errorMessage = error?.error ?? 'An error has occurred during the operation.';
        this.notificationService.showErrorToast(errorMessage)
        this.loadingButton = false;
        this.getallSale()
      }

    })
   
  }

  cancel(){
    this.handlers.visibleCreate = false;
  }
  
  openCreate() {
    this.isEditMode = false;
    this.handlers.headerDialog = 'Create Sale'
    this.createForm.reset();
    this.handlers.handleInsertDialog()
  }


}
