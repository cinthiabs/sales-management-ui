import { Component, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { FormBuilder, FormGroup, FormsModule , ReactiveFormsModule, Validators} from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NotificationService } from '../../../services/shared/messages/notification.service';
import { Title } from '@angular/platform-browser';
import { Product } from '../../../models/products/products';
import { RegisterProductHandlers } from './register-product-handlers';
import { ProductsService } from '../../../services/products/products.service';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-register-products',
  standalone: true,
  imports: [ButtonModule,
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
    InputNumberModule,
    InputTextModule],
  templateUrl: './register-products.component.html',
  styleUrl: './register-products.component.scss',
  providers: [MessageService, NotificationService, ConfirmationService],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterProductsComponent implements OnInit {
  @ViewChild('dt') dataTable!: Table;
  products: Product[] = [];
  selectedProducts: any = [];
  loadingTable = false;
  loadingButton = false;
  messageTable = 'No data found';
  isEditMode: boolean = false;
  product!: Product;
  productId: number = 0;
  isViewing: boolean = false;

  createForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    details: ['', Validators.required],
    active: ['',Validators.required],
    price: ['',Validators.required],
    createDate: [{value: '', disabled: true}],
    editDate: [{value: '', disabled: true}] 
  })
  constructor(
    private fb: FormBuilder,
    private titleService: Title,
    private notificationService: NotificationService,
    public handlers: RegisterProductHandlers,
    private confirmationService: ConfirmationService,
    private productService: ProductsService
  ){
    this.titleService.setTitle('Register Product')
  }

  ngOnInit() {
    this.getAllProducts()
  }

  filterGlobal(event: any){
    const filterValue = event.target.value.trim().toLowerCase();
    this.dataTable.filterGlobal(filterValue, 'contains');
  }

  getAllProducts(){
    this.productService.getAllProducts().subscribe({
      next:(response) => {
        this.products = response.flat()
      },
      error: () => {
        this.messageTable = 'No data found';
      }
    })
  }
  
  deleteProduct(id: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this product?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loadingTable = true;
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            this.notificationService.showSuccessToast('Product successfully deleted!');
            this.loadingTable = false;
            this.getAllProducts();
          },
          error: (error) => {
            const errorMessage = error?.error?.message ?? 'An error has occurred during the operation.';
            this.notificationService.showErrorToast(errorMessage);
            this.loadingTable = false;
          }
        });
      }
    });
  }

  dialogEdit(product: Product){
    this.isEditMode = true;
    this.isViewing = false;
    this.handlers.headerDialog = 'Edit Cost'
    this.handlers.handleInsertDialog()
    if(!!product.id){
      this.productId = product.id
    }
    const activeValue = this.handlers.active.find(s => s.value === product.active);
    this.createForm.patchValue({
      name: product.name,
      details: product.details,
      active: activeValue,
      price: product.price,
    });
    this.createForm.enable();
  }

  editProduct(form: FormGroup) { 
    this.isViewing = false;
    this.loadingButton = true;
    this.product = {
      id: this.productId,
      name: form.get('name')?.value,
      details: form.get('details')?.value,
      active: form.get('active')?.value.value,
      price: form.get('price')?.value
    };
    this.productService.updateProduct(this.product, this.productId).subscribe({
      next:() => {
        this.notificationService.showSuccessToast('Product successfully updated!')
        this.handlers.visibleCreate = false;
        this.loadingButton = false;
        this.getAllProducts()
      },
      error: (error) => {
        const errorMessage = error?.error ?? 'An error has occurred during the operation.';
        this.notificationService.showErrorToast(errorMessage)
        this.loadingButton = false;
      }
    })
  }

  getProductById(id: number) {
    this.isViewing = true; 
    this.handlers.headerDialog = 'View Product';
    this.handlers.handleInsertDialog();
  
    if (!!id) {
      this.productId = id;
    }
    this.productService.getByIdProduct(id).subscribe({
      next: (response) => {
        this.createForm.patchValue({
          name: response.name,
          details: response.details,
          active: this.handlers.active.find(option => option.value === response.active), 
          price: response.price,
          createDate: response.dateCreate ? new Date(response.dateCreate).toLocaleDateString('pt-BR') : null,
          editDate: response.dateEdit ? new Date(response.dateEdit).toLocaleDateString('pt-BR') : null,
        });
        this.createForm.disable();
        console.log(response)
      },

      error: (error) => {
        const errorMessage = error?.error?.message ?? 'An error has occurred during the operation.';
        this.notificationService.showErrorToast(errorMessage);
        this.loadingButton = false;
      }
    });
  }
  CreateOrEdit(form: FormGroup) {
    if (this.isEditMode) {
      this.editProduct(form);
    } else {
      this.saveNewProduct(form);
    }
  }
  saveNewProduct(form: FormGroup){
    if (form.invalid) {
      this.notificationService.showErrorToast('Please fill in all required fields.');
      return;
    }
    this.loadingButton = true;
    this.product = {
      id: this.productId,
      name: form.get('name')?.value,
      details: form.get('details')?.value,
      active: form.get('active')?.value.value,
      price: form.get('price')?.value
    };
    this.productService.postCreateProduct(this.product).subscribe({
      next:() => {
        this.notificationService.showSuccessToast('Product created successfully!')
        this.handlers.visibleCreate = false;
        this.loadingButton = false;
        this.getAllProducts()
      },
      error: (error) => {
        const errorMessage = error?.error ?? 'An error has occurred during the operation.';
        this.notificationService.showErrorToast(errorMessage)
        this.loadingButton = false;
        this.getAllProducts()
      }
    })
  }

  cancel(){
    this.handlers.visibleCreate = false;
  }

  openCreate() {
    this.isViewing = false;
    this.isEditMode = false;
    this.handlers.headerDialog = 'Create Product'
    this.createForm.reset();
    this.handlers.handleInsertDialog()
  }
}

