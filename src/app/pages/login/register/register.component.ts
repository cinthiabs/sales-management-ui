import { Component, ViewChild } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { UserService } from '../../../services/user/user.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NotificationService } from '../../../services/shared/messages/notification.service';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Response  } from '../../../models/shared/response';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Authentication, AuthenticationResponse } from '../../../models/user/authentication';
import { Router, RouterModule } from '@angular/router';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [DividerModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    PasswordModule, 
    FloatLabelModule,
    ReactiveFormsModule,
    LoadingComponent,
    RouterModule,
    ToastModule],
  providers: [MessageService, NotificationService, ConfirmationService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  @ViewChild(LoadingComponent) loadingComponent!: LoadingComponent;

  authentication! : Authentication;
  responseAuth: Response<AuthenticationResponse> | null = null;
  createForm: FormGroup = this.fb.group({
    name: ['',Validators.required],
    email:['',Validators.required],
    password: ['', Validators.required, Validators.minLength(6)],
    confirmPassword: ['', Validators.required,Validators.minLength(6)]
  })

  constructor(
    private fb: FormBuilder,
    private titleService: Title,
    private router: Router,
    private notificationService: NotificationService,
    private userService: UserService
  ){
    this.titleService.setTitle('Login')
  }

  postCreateUser(form: FormGroup) {
    if (form.invalid) {
      this.notificationService.showErrorToast('Por favor, preencha todos os campos.');
      return;
    }

    if (form.get('password')?.value !== form.get('confirmPassword')?.value) {
      this.notificationService.showErrorToast('As senhas não coincidem.');
      return;
    }

    const regex = /^([^@]+)@/;
    const username = form.get('email')?.value.match(regex);

    this.authentication = {
      email: form.get('email')?.value,
      password: form.get('password')?.value,
      confirmPassword: form.get('confirmPassword')?.value,
      username: username ? username[1] : '',
      name: form.get('name')?.value
    };
    localStorage.setItem('username', this.authentication.username!);
    
    this.loadingComponent.show();

    this.userService.postCreateUser(this.authentication).subscribe({
      next: () => {
        this.notificationService.showSuccessToast('Conta criada com sucesso! Você será direcionando para a pagina de login.');
        setTimeout(() => {
          this.router.navigate(['/auth']);
        }, 3000);
      },
      error: (error) => {
        this.loadingComponent.hide();
        if (error.status === 409) {
          this.notificationService.showErrorToast('O usuário já está cadastrado. Por favor, faça login.');
        } else{
          this.notificationService.showErrorToast('Ocorreu um erro durante a operação. Tente novamente mais tarde.');
        } 
      },
      complete: () => {
        this.loadingComponent.hide();
      }
    });
  }
}
