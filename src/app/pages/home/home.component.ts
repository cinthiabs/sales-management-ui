import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { startOfMonth, endOfMonth } from 'date-fns';
import { FormGroup, FormsModule } from '@angular/forms';
import { SalesService } from '../../services/sales/sales.service';
import { RelQuantitySale } from '../../models/sales/sale';
import { TableModule } from 'primeng/table';
import { CostsService } from '../../services/costs/costs.service';
import { RelCostPrice } from '../../models/costs/costs';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../shared/components/loading/loading.component';

@Component({
  selector: 'app-home',
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
          LoadingComponent
        ],
  providers:[],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  @ViewChild(LoadingComponent) loadingComponent!: LoadingComponent;

 selectedDate?: Date[];
 selectedNewDate?: Date[];
 datePickerOptions: any;
 filterForm!: FormGroup;
 salesPrice: number = 0;
 totalPrice: number = 0;
 totalQuantity: number = 0;
 totalProfit: number = 0;
 relQuantitySale: RelQuantitySale[] = [];
 relCostPrice: RelCostPrice[] = [];
 salesData: any; 
 salesOptions: any;
 costsData: any;
 costsOptions: any;

 constructor(
  private salesService: SalesService,
  private costService: CostsService
 ) {}

  ngOnInit() {
    this.setDate()
    this.getRel()
  }

  getRel(){
    const startDate = this.selectedDate ? new Date(this.selectedDate[0]).toISOString().split('T')[0] : '';
    const endDate = this.selectedDate ? new Date(this.selectedDate[1]).toISOString().split('T')[0] : '';
      this.getRelQuantity(startDate, endDate),
      this.getRelCostPrice(startDate, endDate)
  }

  getRelQuantity(startDate: string, endDate: string){
    this.loadingComponent.show();
    this.salesService.getRelQuantity(startDate,endDate).subscribe({
      next:(response) => {
       this.relQuantitySale = response.flat()
       this.salesPrice = this.relQuantitySale.reduce((acc, current) => acc + current.price, 0);
       this.totalQuantity = this.relQuantitySale.reduce((acc, current) => acc + current.quantity, 0);
       this.transformDataForChart(this.relQuantitySale);
       this.transformDataPayForChart(this.relQuantitySale);
       this.calculateTotalProfit();
       this.loadingComponent.hide();

      }
    
    })
  }
  
  getRelCostPrice(startDate: string, endDate: string){
    this.costService.getRelCostPrice(startDate,endDate).subscribe({
      next:(response) => {
       this.relCostPrice = response.flat()
       this.totalPrice = this.relCostPrice.reduce((acc, current) => acc + current.totalPrice, 0);
       this.calculateTotalProfit();
      }
      
    })
  }

  calculateTotalProfit() {
    this.totalProfit = this.salesPrice - this.totalPrice;
  }

  onDateSelect(event: any) {
    if(this.selectedDate && this.selectedDate[1] !== undefined && this.selectedDate[1] !== null){
      this.getRel()
    }
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

  transformDataForChart(data: any[]) {
    const labels = data.map(item => item.name);
    const quantities = data.map(item => item.quantity);
    const prices = data.map(item => item.price);

    this.salesData = {
      labels: labels,
      datasets: [
        {
          label: 'Quantity',
          backgroundColor: '#42A5F5',
          borderColor: '#d7ecfb',
          data: quantities
        }
      ]
    };

    this.salesOptions = {
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
  
    this.costsData = {
        labels: ['Pending', 'Paid'],
        datasets: [
            {
                data: [notPaid, paid],
                backgroundColor: ['#D43241', '#22C55E'],
                hoverBackgroundColor:  ['#D43241', '#22C55E']
            }
        ]
    };

    this.costsOptions = {
        responsive: true,
        maintainAspectRatio: false
    };
  }

}

