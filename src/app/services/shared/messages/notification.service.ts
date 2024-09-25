import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})

export class NotificationService {

  constructor(private messageService: MessageService) { }

  showSuccessToast(detail: string) {
    this.messageService.add({
      key: 'success',
      severity: 'success',
      summary: 'Sucesso',
      detail,
    });
  }

  showErrorToast(detail: string) {
    this.messageService.add({
      key: 'error',
      severity: 'error',
      summary: 'Erro',
      detail,
    });
  }
}
