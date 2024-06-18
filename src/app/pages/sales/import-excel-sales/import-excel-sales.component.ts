import { Component,OnInit} from '@angular/core';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SalesService } from '../../../services/sales.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-import-excel-sales',
  standalone: true,
  imports: [
    FileUploadModule, 
    ProgressSpinnerModule, 
    CommonModule],
  templateUrl: './import-excel-sales.component.html',
  styleUrl: './import-excel-sales.component.scss'
})
export class ImportExcelSalesComponent implements OnInit {
  loadingUpload = false;
  returnMessage = '';

  constructor(private salesService: SalesService){}
  ngOnInit(): void {
    this.salesService.getAllSales().subscribe({
      next:(response: any) => {
        console.log(response)
      }
    })
  }

  onSelect(event: FileSelectEvent) {
    this.loadingUpload = true;
    const uploadFile = event.files && event.files.length > 0 ? event.files[0] : null;
    if (uploadFile) {
      console.log(uploadFile)
      this.salesService.postUploadExcel(uploadFile).subscribe({
        next: (response: any) => {
          if (!response) this.returnMessage = 'Upload completed successfully!';
          console.log(this.returnMessage)
          this.loadingUpload = false;
        },
        error: (error: any) => {
          console.error(error)
          this.returnMessage = error.error
          this.loadingUpload = false;
        }
      })
    }
  }
}
