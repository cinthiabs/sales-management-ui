import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule , ReactiveFormsModule, Validators} from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';  
import { InputTextModule } from 'primeng/inputtext';  
import { CardModule } from 'primeng/card';  
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,FileUploadModule,ButtonModule,InputTextModule,CardModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {


  updateUserProfile(){

  }
  onPhotoUpload(event: any){

  }
}
