import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { InputMaskModule } from 'primeng/inputmask';
import { ButtonModule } from 'primeng/button';  
import { InputTextModule } from 'primeng/inputtext';  
import { CardModule } from 'primeng/card';  
import { DropdownModule } from 'primeng/dropdown';
import { Title } from '@angular/platform-browser';
import { NotificationService } from '../../../services/shared/messages/notification.service';
import { MessageService } from 'primeng/api';
import { ProfileService } from '../../../services/profile/profile.service';
import { UserProfile } from '../../../models/user/profile';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputMaskModule,
    FileUploadModule,
    ButtonModule,
    InputTextModule,
    CardModule, 
    DropdownModule
  ],
  providers: [MessageService, NotificationService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  userProfile: UserProfile[] = [];
  profile!: UserProfile;
  imageDefault: string = '';
  username = localStorage.getItem('username');
  
  userTypes = [
    { name: 'Adm', value: 1 },
    { name: 'Usuario', value: 2 }
  ];

  createForm: FormGroup = this.fb.group({
    image: [''],
    username: [''],
    firstName: [''],
    lastName: [''],
    email: [''],
    phone: [''],
    address: [''],
    city: [''],
    state: [''],
    zipCode: [''],
    num: [''],
    accessLevelId: ['']
  });

  constructor(
    private fb: FormBuilder,
    private titleService: Title,
    private notificationService: NotificationService,
    private profileService: ProfileService
  ) {
    this.titleService.setTitle('Perfil');
  }

  ngOnInit() {
    this.getProfile();
  }
  
  onPhotoSelect(event: any) {
    const file = event.files[0]; 
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageDefault = e.target.result; 
        this.userProfile[0].image = this.imageDefault;
      };
      reader.readAsDataURL(file); 
      console.log(this.userProfile);
    }
  }

  getProfile() {
    if (this.username == null) return; 

    this.profileService.getByUserProfile(this.username!).subscribe({
      next: (response) => {
        this.createForm.patchValue({
          image: response.data[0].image,
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
      },
      error: (error) => {
        const errorMessage = error?.error?.message ?? 'Ocorreu um erro ao carregar o perfil.';
        this.notificationService.showErrorToast(errorMessage);
      }
    });
  }
  
  updateUserProfile(form: FormGroup) {
    if (this.username == null) return; 
    
    const objUser = {
      image: this.imageDefault,
      username: form.get('username')?.value,
      firstName: form.get('firstName')?.value,
      lastName: form.get('lastName')?.value,
      phone: form.get('phone')?.value,
      address: form.get('address')?.value,
      city: form.get('city')?.value,
      state: form.get('state')?.value,
      zipCode: form.get('zipCode')?.value,
      accessLevelId: form.get('accessLevelId')?.value.value, 
    };

    this.profileService.updateUserProfile(objUser, this.username).subscribe({
      next: () => {
        this.notificationService.showSuccessToast('Dados atualizados com sucesso!');
      },
      error: (error) => {
        const errorMessage = error?.error ?? 'Ocorreu um erro durante a operação.';
        this.notificationService.showErrorToast(errorMessage);
      }
    });
  }
}