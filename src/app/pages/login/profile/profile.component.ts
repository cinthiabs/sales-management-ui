import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule , ReactiveFormsModule, Validators} from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';  
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';  
import { CardModule } from 'primeng/card';  
import { DropdownModule } from 'primeng/dropdown';
import { Title } from '@angular/platform-browser';
import { NotificationService } from '../../../services/shared/messages/notification.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProfileService } from '../../../services/profile/profile.service';
import { UserProfile } from '../../../models/user/profile';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,InputMaskModule,FileUploadModule,ButtonModule,InputTextModule,CardModule, DropdownModule],
  providers: [MessageService, NotificationService, ConfirmationService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  userProfile : UserProfile[] = [];
  
  userTypes = [
    {name: 'Adm', value: 1},
    {name: 'Usuario', value: 2}
  ]

  createForm: FormGroup = this.fb.group({
    image: [''],
    username:[''],
    firstName: [''],
    lastName: [''],
    email: [''],
    phone: [''],
    address: [''],
    city: [''],
    state: [''],
    zipCode: [''],
    num:[''],
    accessLevelId: ['']
  })
  constructor(
    private fb: FormBuilder,
    private titleService: Title,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService,
    private profileService: ProfileService
    ){
      this.titleService.setTitle('Perfil');
    }


  ngOnInit() {
      this.getProfile()
  }
  
  onPhotoUpload(event: any){
  }

  getProfile() {
    this.profileService.getByIdUserProfile(2).subscribe({
      next: (response) => {
        this.createForm.patchValue({
          image:response.data[0].image,
          username: response.data[0].username,
          firstName: response.data[0].firstName,
          lastName: response.data[0].lastName,
          email: response.data[0].email,
          phone: response.data[0].phone,
          address: response.data[0].address,
          city: response.data[0].city,
          state: response.data[0].state,
          zipCode: response.data[0].zipCode,
          accessLevelId: this.userTypes.find(option => option.value === response.data[0].accessLevelId)
        });
        console.log(response)
      },
      error: (error) => {
        const errorMessage = error?.error?.message ?? 'Ocorreu um erro ao carregar o perfil.';
        this.notificationService.showErrorToast(errorMessage);
      }
    });
  }
  
  updateUserProfile(){
  }

}
