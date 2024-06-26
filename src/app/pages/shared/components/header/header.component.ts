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
   constructor(private route: ActivatedRoute) {}

   ngOnInit() {

    this.items = [
      { label: 'Home', icon: 'pi pi-home', route: '/' },
      {
        label: 'Sales',
        items: [
          { label: 'Import Excel', icon: 'pi pi-file-excel', route: '/import-excel-sales' },
          { label: 'Register Sale', icon: 'pi pi-file-plus', route: '/register-sales' },
          { label: 'Edit Regiter', icon: 'pi pi-file-edit', route: '/' }
        ]
      },
      {
        label: 'Products',
        items: [
          { label: 'Register Product', icon: 'pi pi-file-plus', route: '/register-products' },
          { label: 'Others', icon: 'pi pi-fw pi-bell', route: '/' }
        ]
      },
      {
        label: 'Costs',
        items: [
          { label: 'Register Costs', icon: 'pi pi-file-plus', route: '/register-costs' },
          { label: 'Others', icon: 'pi pi-fw pi-bell', route: '/' }
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
  }

}
