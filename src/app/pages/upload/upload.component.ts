import { Component, ViewChild, ViewEncapsulation} from '@angular/core';
import { FileSelectEvent, FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { NotificationService } from '../../services/shared/messages/notification.service';
import { UploadService } from '../../services/upload/upload.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    FileUploadModule, 
    ProgressSpinnerModule,
    ToastModule,
    CommonModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss',
  providers: [MessageService, NotificationService],
  encapsulation: ViewEncapsulation.None,
})
export class UploadComponent {
  @ViewChild(FileUpload) fileUpload!: FileUpload; 
  loadingUpload = false;
  returnMessage = '';

  constructor(private upload: UploadService,
    private titleService: Title,
    private notificationService: NotificationService
  ){
    this.titleService.setTitle('Importação de arquivo');
  }
  
  onSelect(event: FileSelectEvent) {
    this.loadingUpload = true;
    const uploadFile = event.files && event.files.length > 0 ? event.files[0] : null;
    if (uploadFile) {
      this.upload.postUploadExcel(uploadFile).subscribe({
        next: (response: any) => {
          if (response) {
            this.notificationService.showSuccessToast('Planilha importada com sucesso!')
            this.loadingUpload = false;
            this.fileUpload.clear();
          }
        },
        error: (error: any) => {
          const errorMessage = error?.error ?? 'Ocorreu um erro durante a operação.';
          this.notificationService.showErrorToast(errorMessage)
          this.loadingUpload = false;
          this.fileUpload.clear();
        }
      })
    }
  }
}
