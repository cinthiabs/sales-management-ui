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
import { LoadingComponent } from '../../shared/components/loading/loading.component';

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
    LoadingComponent,
    InputTextModule],
  templateUrl: './register-products.component.html',
  styleUrl: './register-products.component.scss',
  providers: [MessageService, NotificationService, ConfirmationService],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterProductsComponent implements OnInit {
  @ViewChild('dt') dataTable!: Table;

  products: Product[] = [];
  allProducts: Product[] = [];
  selectedProducts: any = [];
  loadingTable = false;
  loadingButton = false;
  messageTable = 'Nenhum dado encontrado';
  isEditMode: boolean = false;
  product!: Product;
  productId: number = 0;
  isViewing: boolean = false;
  search: string = '';

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
    this.titleService.setTitle('Registrar Produto')
  }

  ngOnInit() {
    this.getAllProducts()
  }

  filterGlobal(event: any) {
    this.search = (event.target as HTMLInputElement).value.trim().toLowerCase();

    if (!this.search) {
        this.products = [...this.allProducts];
        return;
    }

    this.products = this.allProducts.filter(
        (item) =>
            (item.dateCreate && item.dateCreate.includes(this.search)) ||
            (item.name && item.name.toLowerCase().includes(this.search)) ||
            (item.details && item.details.toLowerCase().includes(this.search)) ||
            (item.price.toString().includes(this.search)) ||
            (item.active !== undefined && (
                (item.active && 'ativo'.includes(this.search)) ||
                (!item.active && 'inativo'.includes(this.search))
        ))
    );
}


  getAllProducts(){
    this.productService.getAllProducts().subscribe({
      next:(response) => {
        this.products = response.data;
      },
      error: () => {
        this.messageTable;
      }
    })
  }
  
  deleteProduct(id: number) {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja excluir esse produto?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',  
      rejectLabel: 'Não',
      accept: () => {
        this.loadingTable = true;
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            this.notificationService.showSuccessToast('Produto excluido com sucesso!');
            this.loadingTable = false;
            this.getAllProducts();
          },
          error: (error) => {
            const errorMessage = error?.error?.message ?? 'Ocorreu um erro durante a operação.';
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
    this.handlers.headerDialog = 'Editar Produto'
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
        this.notificationService.showSuccessToast('Produto atualizado com sucesso!')
        this.handlers.visibleCreate = false;
        this.loadingButton = false;
        this.getAllProducts()
      },
      error: (error) => {
        const errorMessage = error?.error ?? 'Ocorreu um erro durante a operação.';
        this.notificationService.showErrorToast(errorMessage)
        this.loadingButton = false;
      }
    })
  }

  getProductById(id: number) {
    this.isViewing = true; 
    this.handlers.headerDialog = 'Visualizar Produto';
    this.handlers.handleInsertDialog();
  
    if (!!id) {
      this.productId = id;
    }
    this.productService.getByIdProduct(id).subscribe({
      next: (response) => {
        this.createForm.patchValue({
          name: response.data[0].name,
          details: response.data[0].details,
          active: this.handlers.active.find(option => option.value === response.data[0].active), 
          price: response.data[0].price,
          createDate: response.data[0].dateCreate ? new Date(response.data[0].dateCreate).toLocaleDateString('pt-BR') : null,
          editDate: response.data[0].dateEdit ? new Date(response.data[0].dateEdit).toLocaleDateString('pt-BR') : null,
        });
        this.createForm.disable();
        console.log(response)
      },

      error: (error) => {
        const errorMessage = error?.error?.message ?? 'Ocorreu um erro durante a operação.';
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
      this.notificationService.showErrorToast('Preencha todos os campo obrigatórios!');
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
        this.notificationService.showSuccessToast('Produto cadastrado com sucesso!')
        this.handlers.visibleCreate = false;
        this.loadingButton = false;
        this.getAllProducts()
      },
      error: (error) => {
        const errorMessage = error?.error ?? 'Ocorreu um erro durante a operação.';
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
    this.handlers.headerDialog = 'Cadastrar Produto'
    this.createForm.reset();
    this.handlers.handleInsertDialog()
  }
}