import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { UserService } from '../../../services/user/user.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NotificationService } from '../../../services/shared/messages/notification.service';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [DividerModule,ButtonModule,InputTextModule],
  providers: [MessageService, NotificationService, ConfirmationService],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  
  createForm: FormGroup = this.fb.group({
    username:['',Validators.required],
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

  } 
  
}
