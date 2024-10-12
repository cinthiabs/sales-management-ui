import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule , ReactiveFormsModule, Validators} from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';  
import { InputTextModule } from 'primeng/inputtext';  
import { CardModule } from 'primeng/card';  
import { DropdownModule } from 'primeng/dropdown';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,FileUploadModule,ButtonModule,InputTextModule,CardModule, DropdownModule],
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
    private fb: FormBuilder){}
  updateUserProfile(){

  }
  onPhotoUpload(event: any){

  }
}
