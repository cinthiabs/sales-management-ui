import { Injectable } from '@angular/core';
import { Sale } from '../../../models/sales/sale';

@Injectable({
  providedIn: 'root'
})
export class RegisterHandlers {
  visibleCreate: boolean = false;
  headerDialog = '';

  constructor() {}
  situation = [
    {name: 'Pago', value: true},
    {name: 'Pendente', value: false}
  ]

  handleInsertDialog() {
    this.visibleCreate = true;
  }
}
