import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule , ReactiveFormsModule, Validators} from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';  
import { InputTextModule } from 'primeng/inputtext';  
import { CardModule } from 'primeng/card';  
import { DropdownModule } from 'primeng/dropdown';
import { Title } from '@angular/platform-browser';
import { NotificationService } from '../../../services/shared/messages/notification.service';
import { ConfirmationService, MessageService } from 'primeng/api';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,FileUploadModule,ButtonModule,InputTextModule,CardModule, DropdownModule],
  providers: [MessageService, NotificationService, ConfirmationService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  userTypes = [
    {name: 'Adm', value: true},
    {name: 'Usuario', value: false}
  ]

  createForm: FormGroup = this.fb.group({
    userTypes: [''],
    createDate: [{value: '', disabled: true}],
    editDate: [{value: '', disabled: true}] 
  })
  constructor(
    private fb: FormBuilder,
    private titleService: Title,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService
    ){
      this.titleService.setTitle('Perfil');
    }

  updateUserProfile(){
  }
  onPhotoUpload(event: any){

  }

  getProfile(){
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



}
