import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { startOfMonth, endOfMonth } from 'date-fns';
import { FormGroup, FormsModule } from '@angular/forms';
import { SalesService } from '../../services/sales/sales.service';
import { RelQuantitySale } from '../../models/sales/sale';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ChartModule,CardModule,CalendarModule, FormsModule],
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
       console.log(this.totalPrice)
       console.log(this.totalQuantity)
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

  formartValor(valor: number): string {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    return formatter.format(valor).replace('.', '|').replace('.', ',').replace('|', '.');
  }
}
