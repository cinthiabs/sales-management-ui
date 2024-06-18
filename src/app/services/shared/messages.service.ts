import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private messageService: MessageService) { }

  showSuccessToast(detail: string) {
    this.messageService.add({
      key: 'success',
      severity: 'success',
      summary: 'Success',
      detail,
    });
  }

  showErrorToast(detail: string) {
    this.messageService.add({
      key: 'error',
      severity: 'error',
      summary: 'Failure',
      detail,
    });
  }
}
