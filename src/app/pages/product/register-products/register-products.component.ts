import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
@Component({
  selector: 'app-register-products',
  standalone: true,
  imports: [TableModule],
  templateUrl: './register-products.component.html',
  styleUrl: './register-products.component.scss'
})
export class RegisterProductsComponent {

}
