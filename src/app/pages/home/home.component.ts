import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { startOfMonth, endOfMonth } from 'date-fns';
import { FormGroup, FormsModule } from '@angular/forms';
import { SalesService } from '../../services/sales/sales.service';
import { RelQuantitySale, Sale } from '../../models/sales/sale';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ChartModule,CardModule,CalendarModule, FormsModule,TableModule],
  providers:[],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
 selectedDate?: Date[];
 selectedNewDate?: Date[];
 datePickerOptions: any;
 filterForm!: FormGroup;
 totalPrice: number = 0;
 totalQuantity: number = 0;
 relQuantitySale: RelQuantitySale[] = [];
 basicData: any; 
 basicOptions: any;


 constructor(
  private salesService: SalesService
 ) {}

  ngOnInit() {
    this.setDate()
    this.getRelQuantity()
  }
  getRelQuantity(){
    const startDate = this.selectedDate ? new Date(this.selectedDate[0]).toISOString().split('T')[0] : '';
    const endDate = this.selectedDate ? new Date(this.selectedDate[1]).toISOString().split('T')[0] : '';
    this.salesService.getRelQuantity(startDate,endDate).subscribe({
      next:(response) => {
       this.relQuantitySale = response.flat()
       this.totalPrice = this.relQuantitySale.reduce((acc, current) => acc + current.price, 0);
       this.totalQuantity = this.relQuantitySale.reduce((acc, current) => acc + current.quantity, 0);

       this.transformDataForChart(this.relQuantitySale);
      }
    })
  }
  onDateSelect(event: any) {
    if(this.selectedDate && this.selectedDate[1] !== undefined && this.selectedDate[1] !== null){
      this.getRelQuantity()
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

  transformDataForChart(data: any[]): void {
    const labels = data.map(item => item.name);
    const quantities = data.map(item => item.quantity);
    const prices = data.map(item => item.price);

    this.basicData = {
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

    this.basicOptions = {
      responsive: true,
      maintainAspectRatio: false
    };
  }

}

