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
import { InputNumberModule } from 'primeng/inputnumber';
import { Sale } from '../../../models/sales/sale';
import { CommonModule } from '@angular/common';
import { SalesService } from '../../../services/sales/sales.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RegisterHandlers } from './register-handlers';
import { Title } from '@angular/platform-browser';
import { NotificationService } from '../../../services/shared/messages/notification.service';
import { Product } from '../../../models/products/products';
import { ProductsService } from '../../../services/products/products.service';
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
    InputNumberModule,
    CalendarModule,
    InputTextModule],
  templateUrl: './register-sales.component.html',
  styleUrl: './register-sales.component.scss',
  providers: [MessageService, NotificationService, ConfirmationService],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterSalesComponent implements OnInit {
  @ViewChild('dt') dataTable!: Table;
  
  sales: Sale[] = [];
  allSales: Sale[] = [];
  selectedSales: any[] = [];
  productObject: Product[] = [];
  loadingTable = false;
  loadingButton = false;
  messageTable = 'Nenhum dado encontrado';
  isEditMode: boolean = false;
  sale! : Sale;
  saleId: number = 0;
  isViewing: boolean = false;
  search = '';
  selectedProduct!: Product;

  createForm: FormGroup = this.fb.group({
    dateSale:['',Validators.required],
    nameProduct: ['', Validators.required],
    details: [''],
    quantity: ['',Validators.required],
    paySelect: [''],
    price: ['',Validators.required],
    createDate: [{value: '', disabled: true}],
    editDate: [{value: '', disabled: true}] 
  })

  constructor(
    private fb: FormBuilder,
    private salesService: SalesService,
    private productService: ProductsService,
    public handlers: RegisterHandlers,
    private titleService: Title,
    private confirmationService: ConfirmationService,
    private notificationService: NotificationService
  ){
    this.titleService.setTitle('Registrar Vendas');
  }

  ngOnInit() {
    this.getallSale()
    this.getProduct()
  }

  filterGlobal(event: any){
    this.search = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (!this.search) {
      this.sales = [...this.allSales];
      return;
    }
    this.sales = this.allSales.filter(
        (item) =>
          item.dateSale && item.dateSale.includes(this.search) ||
          item.dateCreate && item.dateCreate.includes(this.search) ||
          item.name && item.name.toLocaleLowerCase().includes(this.search)||
          item.details && item.details.toLocaleLowerCase().includes(this.search)||
          item.quantity.toString().includes(this.search)||
          item.price.toString().includes(this.search) ||
          (item.pay !== undefined && (
            (item.pay && 'pago'.includes(this.search)) ||
            (!item.pay && 'pendente'.includes(this.search))
        ))
    );
  }

  getallSale(){
    this.salesService.getAllSales().subscribe({
      next:(response) => {
        this.allSales = response.data.flat()
        this.sales = [...this.allSales];
      },
      error: () => {
        this.messageTable;
      }
    })
  }

  getProduct(){
    this.productService.getAllProducts().subscribe(
      (response) => {
        if (response) {
          this.productObject = response.data;
        }
      }
    );
  }

  onProductSelect(event: any){
    this.selectedProduct = event.value; 
  }

  deleteSale(id: number) { 
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir esse registro?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',  
      rejectLabel: 'Não',
      accept: () => {
        this.loadingTable = true;
        this.salesService.deleteSale(id).subscribe({
          next:() => {
              this.notificationService.showSuccessToast('Registro excluido com sucesso!')
              this.loadingTable = false;
              this.getallSale()
          },
          error: (error) => {
            const errorMessage = error?.error ?? 'Ocorreu um erro durante a operação.';
            this.notificationService.showErrorToast(errorMessage)
            this.loadingTable = false;
          }  
        })
      }
    });
  }

  dialogEdit(sale: Sale){
    this.isEditMode = true;
    this.isViewing = false;
    this.handlers.headerDialog = 'Editar Venda'
    this.handlers.handleInsertDialog()
    if(!!sale.id){
      this.saleId = sale.id
    }

    const payValue = this.handlers.situation.find(s => s.value === sale.pay);
    const selectedProduct = this.productObject.find(product => product.id === sale.idProduct);
    this.createForm.patchValue({
      dateSale: new Date (sale.dateSale),
      nameProduct: selectedProduct,
      details: sale.details,
      quantity: sale.quantity,
      paySelect: payValue,
      price: sale.price,
    });
    this.createForm.enable();
  }

  editSale(form: FormGroup) { 
    const selectedProduct = form.get('nameProduct')?.value;
    this.isViewing = false;
    this.loadingButton = true;
    this.sale = {
      id: this.saleId,
      idProduct: selectedProduct.id,
      name: selectedProduct.name,
      dateSale: new Date(form.get('dateSale')?.value).toISOString().split('T')[0],
      details: form.get('details')?.value,
      quantity: form.get('quantity')?.value,
      pay: form.get('paySelect')?.value.value, 
      price: form.get('price')?.value
    };
    this.salesService.updateSale(this.sale, this.saleId).subscribe({
      next:() => {
        this.notificationService.showSuccessToast('Venda atualizada com sucesso!')
        this.handlers.visibleCreate = false;
        this.loadingButton = false;
        this.getallSale()
      },
      error: (error) => {
        const errorMessage = error?.error ?? 'Ocorreu um erro durante a operação.';
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
    if (form.invalid) {
      this.notificationService.showErrorToast('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    this.loadingButton = true;
    this.sale = {
      idProduct : this.selectedProduct.id,
      name:  this.selectedProduct.name,
      dateSale: new Date(form.get('dateSale')?.value).toISOString().split('T')[0],
      details: form.get('details')?.value,
      quantity: form.get('quantity')?.value,
      pay: form.get('paySelect')?.value.value, 
      price: form.get('price')?.value,
    };
    this.salesService.postCreateSale(this.sale).subscribe({
      next:() => {
        this.notificationService.showSuccessToast('Venda criada com sucesso!')
        this.handlers.visibleCreate = false;
        this.loadingButton = false;
        this.getallSale()

      },
      error: (error) => {
        const errorMessage = error?.error ?? 'Ocorreu um erro durante a operação.';
        this.notificationService.showErrorToast(errorMessage)
        this.loadingButton = false;
        this.getallSale()
      }

    })
  }

  getSaleById(id: number){
    this.isViewing = true; 
    this.handlers.headerDialog = 'Visualizar Venda';
    this.handlers.handleInsertDialog();
    if (!!id) {
      this.saleId = id;
    }

    this.salesService.getByIdSale(id).subscribe({
      next: (response) => {
        this.createForm.patchValue({
          nameProduct: this.productObject.find(product => product.id === response.data[0].idProduct),
          dateSale: response.data[0].dateSale ? new Date(response.data[0].dateSale).toLocaleDateString('pt-BR') : null,
          details: response.data[0].details,
          paySelect:  this.handlers.situation.find(option => option.value === response.data[0].pay),
          price: response.data[0].price,
          quantity: response.data[0].quantity,
          createDate: response.data[0].dateCreate ? new Date(response.data[0].dateCreate).toLocaleDateString('pt-BR') : null,
          editDate: response.data[0].dateEdit ? new Date(response.data[0].dateEdit).toLocaleDateString('pt-BR') : null,
        });
        this.createForm.disable();
      },

      error: (error) => {
        const errorMessage = error?.error?.message ?? 'Ocorreu um erro durante a operação.';
        this.notificationService.showErrorToast(errorMessage);
        this.loadingButton = false;
      }
    })
  }

  cancel(){
    this.handlers.visibleCreate = false;
  }
  
  openCreate() {
    this.isViewing = false;
    this.isEditMode = false;
    this.handlers.headerDialog = 'Criar Venda'
    this.createForm.reset();
    this.handlers.handleInsertDialog()
  }

}