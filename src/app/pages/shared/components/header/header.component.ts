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
          { label: 'Custo do produto', icon: 'pi pi-calculator', route: '/calculate' },
          { label: 'Relátorio', icon: 'pi pi-align-justify', route: '/report-costs' }
        ]
      },
      {
        label: 'Clientes',
        items: [
          { label: 'Registrar', icon: 'pi pi-file-plus', route: '/register-client' },
          { label: 'Relátorio', icon: 'pi pi-align-justify', route: '/report-clients' }
        ]
      }
    ];

    this.userMenu = [
      { label: '', icon: 'pi pi-user', route: '/profile'}
    ];
  }

}
