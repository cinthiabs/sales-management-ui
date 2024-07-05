import { Component } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';


@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [SidebarModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {
  sidebarVisible: boolean = false;
}
