import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { startOfMonth, endOfMonth } from 'date-fns';
import { FormGroup, FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ClientService } from '../../../services/client/client.service';
import { Client, RelClients } from '../../../models/client/client';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-report-clients',
  standalone: true,
  imports: 
        [
          ChartModule,
          CardModule,
          CalendarModule,
          FormsModule,
          TableModule,
          TagModule,
          CommonModule,
          LoadingComponent,
          DropdownModule
        ],
  providers:[],
  templateUrl: './report-clients.component.html',
  styleUrl: './report-clients.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ReportClientsComponent  implements OnInit{
  @ViewChild(LoadingComponent) loadingComponent!: LoadingComponent;
  
  selectedDate?: Date[];
  selectedNewDate?: Date[];
  datePickerOptions: any;
  filterForm!: FormGroup;
  relClients: RelClients[] = [];
  clientData: any;
  clientOptions: any;
  selectedClient!: Client;
  clients:Client[] = [];
  clientObject: Client[] = [];

  constructor(
    private clientService: ClientService ) {}

  ngOnInit() {
   this.getRel();
   this.getallClient();
  }

  getRel(){
    const startDate = this.selectedDate ? new Date(this.selectedDate[0]).toISOString().split('T')[0] : '';
    const endDate = this.selectedDate ? new Date(this.selectedDate[1]).toISOString().split('T')[0] : '';
      this.getRelClients(startDate, endDate)
  }

  getallClient(){
    this.clientService.getAllClients().subscribe({
      next: (response) => {
        this.clientObject = response.data;
      }
    });
  } 
  onClientSelect(event: any){
    this.selectedClient = event.value; 
  }
  getRelClients(startDate: string, endDate: string){
    this.clientService.getRelQuantity(startDate,endDate,this.selectedClient.id).subscribe({
      next:(response) => {
       this.relClients = response.flat()
      // this.salesPrice = this.relQuantitySale.reduce((acc, current) => acc + current.price, 0);
      // this.totalQuantity = this.relQuantitySale.reduce((acc, current) => acc + current.quantity, 0);
     //  this.transformDataForChart(this.relQuantitySale);
     //  this.transformDataPayForChart(this.relQuantitySale);
       this.loadingComponent.hide();
       console.log(this.relClients)
      },
      error: () => {
        this.loadingComponent.hide();
      }
    })
  }

  setDate(){
    const startDate = startOfMonth(new Date());
    const endDate = endOfMonth(new Date());
    this.selectedDate = [startDate, endDate];
  
    this.datePickerOptions = {
      dateFormat: 'dd/mm/yy',
    };
  }

  formartValor(valor: number) {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    return formatter.format(valor).replace('.', '|').replace('.', ',').replace('|', '.');
  }

  onDateSelect(event: any) {
    if(this.selectedDate && this.selectedDate[1] !== undefined && this.selectedDate[1] !== null){
      this.getRel()
    }
  }

  transformDataForChart(data: any[]) {
    const labels = data.map(item => item.name);
    const quantities = data.map(item => item.quantity);
    const prices = data.map(item => item.price);

    this.clientData = {
      labels: labels,
      datasets: [
        {
          label: 'Quantidade',
          backgroundColor: '#42A5F5',
          borderColor: '#d7ecfb',
          data: quantities
        }
      ]
    };

    this.clientData = {
      responsive: true,
      maintainAspectRatio: false
    };
  }

  transformDataPayForChart(data: any[]) {
    let paid = 0;
    let notPaid = 0;

    data.forEach(item => {
      paid += item.paid;
      notPaid += item.notPaid;
  });
  
    this.clientData = {
        labels: ['Pendente', 'Pago'],
        datasets: [
            {
                data: [notPaid, paid],
                backgroundColor: ['#D43241', '#22C55E'],
                hoverBackgroundColor:  ['#D43241', '#22C55E']
            }
        ]
    };

    this.clientOptions = {
        responsive: true,
        maintainAspectRatio: false
    };
  }
}
