import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Cost } from '../../../models/costs/costs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
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
import { FormBuilder, FormGroup, FormsModule , ReactiveFormsModule, Validators} from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NotificationService } from '../../../services/shared/messages/notification.service';
import { CostsService } from '../../../services/costs/costs.service';
import { RegisterCostHandlers } from './register-cost-handlers';
import { Title } from '@angular/platform-browser';
import { InputNumberModule } from 'primeng/inputnumber';
import { LoadingComponent } from '../../shared/components/loading/loading.component';

@Component({
  selector: 'app-register-costs',
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
    InputNumberModule,
    DropdownModule,
    CalendarModule,
    LoadingComponent,
    ProgressSpinnerModule,
    InputTextModule],
  templateUrl: './register-costs.component.html',
  styleUrl: './register-costs.component.scss',
  providers: [MessageService, NotificationService, ConfirmationService],
  encapsulation: ViewEncapsulation.None,

})
export class RegisterCostsComponent implements OnInit  {
  @ViewChild('dt') dataTable!: Table;
  @ViewChild(LoadingComponent) loadingComponent!: LoadingComponent;

  costs: Cost[] = [];
  allCosts: Cost[] = [];
  selectedCosts: any = [];
  loadingTable = false;
  loadingButton = false;
  messageTable = 'Nenhum dado encontrado';
  isEditMode: boolean = false;
  cost! : Cost;
  costId: number = 0;
  search = '';
  
  createForm: FormGroup = this.fb.group({
    name:['',Validators.required],
    dateCost: ['', Validators.required],
    quantity: ['',Validators.required],
    unitPrice: [''],
    price: ['',Validators.required]
  })
  constructor(
    private fb: FormBuilder,
    private costsService: CostsService,
    public handlers: RegisterCostHandlers,
    private titleService: Title,
    private confirmationService: ConfirmationService,
    private notificationService: NotificationService
  ){
    this.titleService.setTitle('Register Costs');
  }

  ngOnInit() {
    this.getallCosts()
  }

  filterGlobal(event: any){
    this.search = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (!this.search) {
      this.costs = [...this.allCosts];
      return;
    }
    this.costs = this.allCosts.filter(
        (item) =>
          item.dateCost && item.dateCost.includes(this.search) ||
          item.dateCreate && item.dateCreate.includes(this.search) ||
          item.name && item.name.toLocaleLowerCase().includes(this.search)||
          item.quantity.toString().includes(this.search)||
          item.unitPrice.toString().includes(this.search) ||
          item.totalPrice.toString().includes(this.search)
    );
  }

  getallCosts(){
    this.costsService.getAllCosts().subscribe({
      next:(response) => {
        this.allCosts = response.data.flat()
        this.costs = [...this.allCosts];

      },
      error: () => {
         this.messageTable;
      }
    })
  }

  deleteCost(id: number) { 
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir esse registro?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',  
      rejectLabel: 'Não', 
      accept: () => {
        this.loadingTable = true;
        this.costsService.deleteCost(id).subscribe({
          next:() => {
              this.notificationService.showSuccessToast('Registro excluido com sucesso!')
              this.loadingTable = false;
              this.getallCosts()
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

  dialogEdit(cost: Cost){
    this.isEditMode = true;
    this.handlers.headerDialog = 'Atualizar Custo'
    this.handlers.handleInsertDialog()
    if(!!cost.id){
      this.costId = cost.id
    }

    this.createForm.patchValue({
      name: cost.name,
      dateCost: new Date (cost.dateCost),
      quantity: cost.quantity,
      unitPrice: cost.unitPrice,
      price: cost.totalPrice,
    });
  }

  editCost(form: FormGroup) { 
    this.loadingButton = true;
    this.cost = {
      id: this.costId,
      name: form.get('name')?.value,
      dateCost: new Date(form.get('dateCost')?.value).toISOString().split('T')[0],
      quantity: form.get('quantity')?.value,
      unitPrice: form.get('unitPrice')?.value,
      totalPrice: form.get('price')?.value
    };
    this.costsService.updateCost(this.cost, this.costId).subscribe({
      next:() => {
        this.notificationService.showSuccessToast('Custo atualizado com sucesso!')
        this.handlers.visibleCreate = false;
        this.loadingButton = false;
        this.getallCosts()
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
      this.editCost(form);
    } else {
      this.saveNewCost(form);
    }
  }

  saveNewCost(form: FormGroup){
    if (form.invalid) {
      this.notificationService.showErrorToast('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    this.loadingButton = true;
    this.cost = {
      name: form.get('name')?.value,
      dateCost: new Date(form.get('dateCost')?.value).toISOString().split('T')[0],
      quantity: form.get('quantity')?.value,
      unitPrice: form.get('unitPrice')?.value,
      totalPrice: form.get('price')?.value
    };
    this.costsService.postCreateCost(this.cost).subscribe({
      next:() => {
        this.notificationService.showSuccessToast('Custo criado com sucesso!')
        this.handlers.visibleCreate = false;
        this.loadingButton = false;
        this.getallCosts()

      },
      error: (error) => {
        const errorMessage = error?.error ?? 'Ocorreu um erro durante a operação. Tente novamente mais tarde.';
        this.notificationService.showErrorToast(errorMessage)
        this.loadingButton = false;
        this.getallCosts()
      }
    })
   
  }

  cancel(){
    this.handlers.visibleCreate = false;
  }
  
  openCreate() {
    this.isEditMode = false;
    this.handlers.headerDialog = 'Cadastrar Custo'
    this.createForm.reset();
    this.handlers.handleInsertDialog()
  }
}
