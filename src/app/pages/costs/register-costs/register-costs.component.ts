import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Cost } from '../../../models/costs/costs';
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
    InputTextModule],
  templateUrl: './register-costs.component.html',
  styleUrl: './register-costs.component.scss',
  providers: [MessageService, NotificationService, ConfirmationService],
  encapsulation: ViewEncapsulation.None,

})
export class RegisterCostsComponent {
  @ViewChild('dt') dataTable!: Table;
  costs: Cost[] = [];
  allCosts: Cost[] = [];
  selectedCosts: any = [];
  loadingTable = false;
  loadingButton = false;
  messageTable = 'No data found';
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
        this.messageTable = 'No data found';
      }
    })
  }

  deleteCost(id: number) { 
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this cost?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loadingTable = true;
        this.costsService.deleteCost(id).subscribe({
          next:() => {
              this.notificationService.showSuccessToast('Cost successfully deleted!')
              this.loadingTable = false;
              this.getallCosts()
          },
          error: (error) => {
            const errorMessage = error?.error ?? 'An error has occurred during the operation.';
            this.notificationService.showErrorToast(errorMessage)
            this.loadingTable = false;
          }
        })
      }
    });
  }

  dialogEdit(cost: Cost){
    this.isEditMode = true;
    this.handlers.headerDialog = 'Edit Cost'
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
        this.notificationService.showSuccessToast('Cost successfully updated!')
        this.handlers.visibleCreate = false;
        this.loadingButton = false;
        this.getallCosts()
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
      this.editCost(form);
    } else {
      this.saveNewCost(form);
    }
  }

  saveNewCost(form: FormGroup){
    if (form.invalid) {
      this.notificationService.showErrorToast('Please fill in all required fields.');
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
        this.notificationService.showSuccessToast('Cost created successfully!')
        this.handlers.visibleCreate = false;
        this.loadingButton = false;
        this.getallCosts()

      },
      error: (error) => {
        const errorMessage = error?.error ?? 'An error has occurred during the operation.';
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
    this.handlers.headerDialog = 'Create Cost'
    this.createForm.reset();
    this.handlers.handleInsertDialog()
  }
}
