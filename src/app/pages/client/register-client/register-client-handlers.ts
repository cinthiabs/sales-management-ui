import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegisterClientHandlers {
  visibleCreate: boolean = false;
  headerDialog = '';

  handleInsertDialog() {
    this.visibleCreate = true;
  }
  active = [
    {name: 'Ativo', value: true},
    {name: 'Inativo', value: false}
  ]
}
