import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegisterCostHandlers {
  visibleCreate: boolean = false;
  headerDialog = '';

  handleInsertDialog() {
    this.visibleCreate = true;
  }

  formartValor(valor: number): string {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    return formatter.format(valor).replace('.', '|').replace('.', ',').replace('|', '.');
  }
}
