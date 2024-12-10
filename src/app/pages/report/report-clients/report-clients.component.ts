import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { startOfMonth, endOfMonth } from 'date-fns';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
          DropdownModule,
          ReactiveFormsModule
        ],
  providers:[],
  templateUrl: './report-clients.component.html',
  styleUrl: './report-clients.component.scss'
})
export class ReportClientsComponent  implements OnInit{
  @ViewChild(LoadingComponent) loadingComponent!: LoadingComponent;
  
  selectedDate?: Date[];
  selectedNewDate?: Date[];
  datePickerOptions: any;
  filterForm!: FormGroup;
  relClients: RelClients[] = [];
  rawData: RelClients[] = [];
  clientData: any;
  clientOptions: any;
  topProductsData: any;
  selectedClient!: Client;
  clients:Client[] = [];
  clientObject: Client[] = [];
  totalQuantity: number = 0;
  salesPrice: number = 0;
  totalPending: number = 0;

  constructor(
    private clientService: ClientService ) {}

  ngOnInit() {
   this.setDate()
   this.getRel();
   this.getallClient();
  }

  ngAfterViewInit() {
    this.loadingComponent.show();
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
  
  getRelClients(startDate: string, endDate: string) {
    const clientId = this.selectedClient?.id ?? 0;

    this.clientService.getRelQuantity(startDate, endDate, clientId).subscribe({
      next: (response) => {
        const rawData = response.data.flat();
        this.rawData = [...rawData];
        const groupedData = rawData.reduce((acc, current) => {
          const key = `${current.productName}-${current.clientName}`;
          if (!acc[key]) {
            acc[key] = {
              productName: current.productName,
              clientName: current.clientName,
              totalQuantity: 0,
              totalPaid: 0, 
              totalPending: 0,
              paidQuantity: 0, 
              pendingQuantity: 0,
            };
          }
  
          acc[key].totalQuantity += current.quantity;
  
          if (current.pay) {
            acc[key].totalPaid += current.price;
            acc[key].paidQuantity += current.quantity;
          } else {
            acc[key].totalPending += current.price;
            acc[key].pendingQuantity += current.quantity;
          }
  
          return acc;
        }, {} as Record<string, any>);
  
        this.relClients = Object.values(groupedData);
  
        this.salesPrice = rawData
          .filter(client => client.pay === true)
          .reduce((acc, current) => acc + current.price, 0);
  
        this.totalPending = rawData
          .filter(client => client.pay === false)
          .reduce((acc, current) => acc + current.price, 0);
  
        this.totalQuantity = rawData.reduce((acc, current) => acc + current.quantity, 0);
  
        this.getTopSellingDays();
        this.getTopSellingProducts();
        this.loadingComponent.hide();
      },
      error: () => {
        this.loadingComponent.hide();
      },
    });
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

  getTopSellingDays() {
    const salesByDay = this.rawData.reduce((acc, current) => {
      const date = current.dateSale || 'Data não especificada';
      if (!acc[date]) {
        acc[date] = { quantity: 0, totalPrice: 0 };
      }
      acc[date].quantity += current.quantity;
      acc[date].totalPrice += current.price;
      return acc;
    }, {} as Record<string, { quantity: number; totalPrice: number }>);
  
    const sortedDays = Object.entries(salesByDay)
      .map(([date, values]) => {
        const formattedDate =
          date !== 'Data não especificada'
            ? new Intl.DateTimeFormat('pt-BR').format(new Date(date))
            : date;
        return {
          date: formattedDate,
          quantity: values.quantity,
          totalPrice: values.totalPrice,
        };
      })
      .sort((a, b) => b.quantity - a.quantity);
  
    this.clientData = {
      labels: sortedDays.map(item => item.date), 
      datasets: [
        {
          label: 'Quantidade de Vendas',
          backgroundColor: '#42A5F5',
          data: sortedDays.map(item => item.quantity),
        },
      ],
    };
  } 
  
  getTopSellingProducts() {
    const salesByProduct = this.rawData.reduce((acc, current) => {
      const { productName, quantity } = current;

      if (!acc[productName]) {
        acc[productName] = 0;
      }
      acc[productName] += quantity;

      return acc;
    }, {} as Record<string, number>);

    const sortedProducts = Object.entries(salesByProduct)
      .map(([product, quantity]) => ({ product, quantity }))
      .sort((a, b) => b.quantity - a.quantity);

    this.topProductsData = {
      labels: sortedProducts.map(item => item.product),
      datasets: [
        {
          label: 'Quantidade Vendida',
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          data: sortedProducts.map(item => item.quantity)
        }
      ]
    };
  }

}
