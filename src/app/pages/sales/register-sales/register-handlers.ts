import { Injectable } from '@angular/core';
import { Sale } from '../../../models/sales/sale';

@Injectable({
  providedIn: 'root'
})
export class RegisterHandlers {
  sale: Sale[];
  visibleCreate: boolean = false;
  
  constructor() {
    this.sale = [{
      id: 1,
      idProduto: 101,
      dateSale: '2024-06-10',
      name: 'Cliente A',
      details: 'Venda do produto X',
      quantity: 1,
      price: 20.0,
      pay: true,
      dataCreate: '2024-06-18T10:00:00',
      dataEdit: '2024-06-18T10:30:00'
    },
    {
      id: 2,
      idProduto: 101,
      dateSale: '2024-06-10',
      name: 'Cliente B',
      details: 'Venda do produto X',
      quantity: 2,
      price: 50.0,
      pay: true,
      dataCreate: '2024-06-18T10:00:00',
      dataEdit: '2024-06-18T10:30:00'
    },
    {
      id: 3,
      idProduto: 101,
      dateSale: '2024-06-11',
      name: 'Cliente C',
      details: 'Venda do produto X',
      quantity: 4,
      price: 150.0,
      pay: false,
      dataCreate: '2024-06-14T10:00:00',
      dataEdit: '2024-06-18T10:30:00'
    },
    {
        id: 4,
        idProduto: 101,
        dateSale: '2024-06-11',
        name: 'Cliente C',
        details: 'Venda do produto X',
        quantity: 1,
        price: 100.0,
        pay: false,
        dataCreate: '2024-06-15T10:00:00',
        dataEdit: '2024-06-18T10:30:00'
    },
    {
        id: 5,
        idProduto: 101,
        dateSale: '2024-06-11',
        name: 'Cliente C',
        details: 'Venda do produto X',
        quantity: 5,
        price: 180.0,
        pay: false,
        dataCreate: '2024-06-15T10:00:00',
        dataEdit: '2024-06-18T10:30:00'
    }];
  }
  situation = [
    {name: 'Pago', value: true},
    {name: 'Pendente', value: false}
  ]
  getSale(): Sale[] {
    return this.sale; // Retorna o array de Sale
  }

  handleInsertDialog() {
    this.visibleCreate = true;
  }
}
