import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MenubarModule, RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  items: any[] = []; 
  userMenu: any[] = [];

   constructor(private route: ActivatedRoute) {}

   ngOnInit() {

    this.items = [
      { label: 'Home', icon: 'pi pi-home', route: '/home' },
      { label: 'Importar', icon: 'pi pi-file-excel', route: '/upload' },
      {
        label: 'Vendas',
        items: [
          { label: 'Registrar', icon: 'pi pi-file-plus', route: '/register-sales' },
          { label: 'Relátorio', icon: 'pi pi-align-justify', route: '/report-sales' },
        ]
      },
      {
        label: 'Produtos',
        items: [
          { label: 'Produtos', icon: 'pi pi-file-plus', route: '/register-products' },
          { label: 'Relátorio', icon: 'pi pi-align-justify', route: '/report-products' }
        ]
      },
      {
        label: 'Custos',
        items: [
          { label: 'Registrar', icon: 'pi pi-file-plus', route: '/register-costs' },
          { label: 'Relátorio', icon: 'pi pi-align-justify', route: '/report-costs' }
        ]
      }
    ];

    this.userMenu = [
      { label: '', icon: 'pi pi-user', route: '/profile'}
    ];
  }

}
