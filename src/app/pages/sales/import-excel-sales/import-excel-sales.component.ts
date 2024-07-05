import { Component, ViewChild, ViewEncapsulation} from '@angular/core';
import { FileSelectEvent, FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { NotificationService } from '../../../services/shared/messages/notification.service';
import { MessageService } from 'primeng/api';
import { UploadService } from '../../../services/upload/sales.service';

@Component({
  selector: 'app-import-excel-sales',
  standalone: true,
  imports: [
    FileUploadModule, 
    ProgressSpinnerModule,
    ToastModule,
    CommonModule],
  templateUrl: './import-excel-sales.component.html',
  styleUrl: './import-excel-sales.component.scss',
  providers: [MessageService, NotificationService],
  encapsulation: ViewEncapsulation.None,
})
export class ImportExcelSalesComponent {
  @ViewChild(FileUpload) fileUpload!: FileUpload; 
  loadingUpload = false;
  returnMessage = '';

  constructor(private upload: UploadService,
    private titleService: Title,
    private notificationService: NotificationService
  ){
    this.titleService.setTitle('Import Excel');
  }


  onSelect(event: FileSelectEvent) {
    this.loadingUpload = true;
    const uploadFile = event.files && event.files.length > 0 ? event.files[0] : null;
    if (uploadFile) {
      this.upload.postUploadExcel(uploadFile).subscribe({
        next: (response: any) => {
          if (response) {
            this.notificationService.showSuccessToast('Data imported successfully!')
            this.loadingUpload = false;
            this.fileUpload.clear();
          }
        },
        error: (error: any) => {
          const errorMessage = error?.error ?? 'An error has occurred during the operation.';
          this.notificationService.showErrorToast(errorMessage)
          this.loadingUpload = false;
          this.fileUpload.clear();
        }
      })
    }
  }
}
