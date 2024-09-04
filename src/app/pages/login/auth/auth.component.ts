import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { UserService } from '../../../services/user/user.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NotificationService } from '../../../services/shared/messages/notification.service';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Response  } from '../../../models/shared/response';
import { Authentication, AuthenticationResponse } from '../../../models/user/authentication';


@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [DividerModule,ButtonModule,InputTextModule,FormsModule, ReactiveFormsModule],
  providers: [MessageService, NotificationService, ConfirmationService],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  authentication! : Authentication;
  responseAuth: Response<AuthenticationResponse[]> | null = null;
  createForm: FormGroup = this.fb.group({
    email:['',Validators.required],
    password: ['', Validators.required]
  })

  constructor(
    private fb: FormBuilder,
    private titleService: Title,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService,
    private userService: UserService
  ){
    this.titleService.setTitle('Login')
  }

  postAuthentication(form: FormGroup){
    if (form.invalid) {
      this.notificationService.showErrorToast('Please fill in all required fields.');
      return;
    }
    const regex = /^([^@]+)@/;
    const username = form.get('email')?.value.match(regex);

    this.authentication = {
      email: form.get('email')?.value,
      password: form.get('password')?.value,
      username: username[1]
    };
    console.log(this.authentication)
    this.userService.postAuthentication(this.authentication).subscribe({
      next:(response) => {
        this.notificationService.showSuccessToast('Cost created successfully!')
      },
      error: (error) => {
        const errorMessage = error?.error ?? 'An error has occurred during the operation.';
        this.notificationService.showErrorToast(errorMessage)
      }

    })
  } 
  
}
