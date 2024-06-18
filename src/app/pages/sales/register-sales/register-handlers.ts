import { Injectable } from '@angular/core';
import { Sale } from '../../../models/sales/sale';

@Injectable({
  providedIn: 'root'
})
export class RegisterHandlers {
  sale: Sale[]; // Declare sale como um array de Sale

  constructor() {
    // Inicialize o array de Sale com um objeto Sale
    this.sale = [{
      id: 1,
      idProduto: 101,
      dateSale: '2024-06-18',
      name: 'Cliente A',
      details: 'Venda do produto X',
      quantity: 2,
      price: 50.0,
      pay: true,
      dataCreate: '2024-06-18T10:00:00',
      dataEdit: '2024-06-18T10:30:00'
    },
    {
      id: 2,
      idProduto: 101,
      dateSale: '2024-06-18',
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
      dateSale: '2024-06-18',
      name: 'Cliente C',
      details: 'Venda do produto X',
      quantity: 2,
      price: 50.0,
      pay: false,
      dataCreate: '2024-06-18T10:00:00',
      dataEdit: '2024-06-18T10:30:00'
    },
    {
        id: 4,
        idProduto: 101,
        dateSale: '2024-06-18',
        name: 'Cliente C',
        details: 'Venda do produto X',
        quantity: 2,
        price: 50.0,
        pay: false,
        dataCreate: '2024-06-18T10:00:00',
        dataEdit: '2024-06-18T10:30:00'
    },
    {
        id: 5,
        idProduto: 101,
        dateSale: '2024-06-18',
        name: 'Cliente C',
        details: 'Venda do produto X',
        quantity: 2,
        price: 50.0,
        pay: false,
        dataCreate: '2024-06-18T10:00:00',
        dataEdit: '2024-06-18T10:30:00'
    }];
  }

  getSale(): Sale[] {
    return this.sale; // Retorna o array de Sale
  }
}
