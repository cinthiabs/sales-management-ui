import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { ToastModule } from 'primeng/toast';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ZipcodeService } from '../../../services/zipcode/zipcode.service';

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
    ToastModule,
    LoadingComponent,
    DropdownModule
  ],
  providers: [MessageService, NotificationService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  @ViewChild(LoadingComponent) loadingComponent!: LoadingComponent;
  userProfile: UserProfile[] = [];
  profile!: UserProfile;
  imageDefault: string = '';
  username = localStorage.getItem('username');
  loadingButton = false;

  
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
    neighborhood: [''],
    state: [''],
    zipCode: [''],
    number: [''],
    accessLevelId: ['']
  });

  constructor(
    private fb: FormBuilder,
    private titleService: Title,
    private notificationService: NotificationService,
    private zipcodeService: ZipcodeService,
    private profileService: ProfileService
  ) {
    this.titleService.setTitle('Perfil');
  }

  ngOnInit() {
    this.getProfile();
  }

  ngAfterViewInit() {
    this.loadingComponent.show();
  }

  getZipCode(): void {
    const zipCode = this.createForm.get('zipCode')?.value.replace(/\D/g, '');
    if (zipCode.length !== 8) return;
  
    this.zipcodeService.getZipCode(zipCode).subscribe({
      next: (data) => {
        const { street, neighborhood, city, state } = data.data[0];
        this.createForm.patchValue(
          { address: street,
            neighborhood,
            city, 
            state 
          });
      },
      error: (error) => {
        let errorMessage = 'Ocorreu um erro durante a operação.';
        if (error?.status === 404) {
          errorMessage = 'Cep Invalido.';
        } else  {
          errorMessage;
        }  
        this.notificationService.showErrorToast(errorMessage);
      }
    });
  }

  onPhotoSelect(event: any) {
    const file = event.files[0]; 
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageDefault = e.target.result; 
        this.createForm.patchValue({ image: this.imageDefault }); 
      };
      reader.readAsDataURL(file); 
    }
  }

  getProfile() {
    if (this.username == null) return; 
    this.profileService.getByUserProfile(this.username!).subscribe({
      next: (response) => {
        const imageBase64 = response.data[0].image 
        ? `data:image/jpg;base64,${response.data[0].image}` : '';

        this.createForm.patchValue({
          image: imageBase64,
          username: response.data[0].username,
          firstName: response.data[0].firstName,
          lastName: response.data[0].lastName,
          email: response.data[0].email,
          phone: response.data[0].phone,
          address: response.data[0].address,
          city: response.data[0].city,
          state: response.data[0].state,
          zipCode: response.data[0].zipCode,
          neighborhood: response.data[0].neighborhood,
          number: response.data[0].number,
          accessLevelId: this.userTypes.find(option => option.value === response.data[0].accessLevelId)
        });
        this.imageDefault = imageBase64;
        this.loadingComponent.hide();
      },
      error: (error) => {
        const errorMessage = error?.error?.message ?? 'Ocorreu um erro ao carregar o perfil.';
        this.notificationService.showErrorToast(errorMessage);
        this.loadingComponent.hide();
      }
    });
  }
  
  updateUserProfile(form: FormGroup) {
    if (this.username == null) return; 
    this.loadingButton = true;

    const objUser = {
      image: this.imageDefault.split(',')[1],
      username: form.get('username')?.value,
      firstName: form.get('firstName')?.value,
      lastName: form.get('lastName')?.value,
      phone: form.get('phone')?.value,
      address: form.get('address')?.value,
      city: form.get('city')?.value,
      state: form.get('state')?.value,
      zipCode: form.get('zipCode')?.value,
      neighborhood: form.get('neighborhood')?.value,
      number: form.get('number')?.value,
      accessLevelId: form.get('accessLevelId')?.value?.value
    };

    this.profileService.updateUserProfile(objUser, this.username).subscribe({
      next: () => {
        this.notificationService.showSuccessToast('Dados atualizados com sucesso!');
        this.loadingButton = false;
      },
      error: (error) => {
        const errorMessage = error?.error ?? 'Ocorreu um erro durante a operação.';
        this.notificationService.showErrorToast(errorMessage);
        this.loadingButton = false;
      }
    });
  }
}