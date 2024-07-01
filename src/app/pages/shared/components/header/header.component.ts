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
      { label: 'Home', icon: 'pi pi-home', route: '/' },
      { label: 'Upload', icon: 'pi pi-file-excel', route: '/upload' },
      {
        label: 'Sales',
        items: [
          { label: 'Register Sale', icon: 'pi pi-file-plus', route: '/register-sales' },
          { label: 'Others', icon: 'pi pi-fw pi-bell', route: '/home' }
        ]
      },
      {
        label: 'Products',
        items: [
          { label: 'Register Product', icon: 'pi pi-file-plus', route: '/register-products' },
          { label: 'Others', icon: 'pi pi-fw pi-bell', route: '/home' }
        ]
      },
      {
        label: 'Costs',
        items: [
          { label: 'Register Costs', icon: 'pi pi-file-plus', route: '/register-costs' },
          { label: 'Others', icon: 'pi pi-fw pi-bell', route: '/home' }
        ]
      },
      {
        label: 'Reports',
        items: [
          { label: 'Sales', icon: 'pi pi-align-justify', route: '/report-sales' },
          { label: 'Products', icon: 'pi pi-align-justify', route: '/report-products' },
          { label: 'Costs', icon: 'pi pi-align-justify', route: '/report-costs' }
        ]
      }
    ];

    this.userMenu = [
      { label: '', icon: 'pi pi-user',route: '/profile'}
    ];
  }

}
