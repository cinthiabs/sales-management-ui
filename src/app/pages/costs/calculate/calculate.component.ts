import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProductCost } from '../../../models/costs/product-cost';
import { DropdownModule } from 'primeng/dropdown';
import { CostsService } from '../../../services/costs/costs.service';
import { Title } from '@angular/platform-browser';
import { NotificationService } from '../../../services/shared/messages/notification.service';
import { Cost } from '../../../models/costs/costs';

@Component({
  selector: 'app-calculate',
  standalone: true,
  imports: [ButtonModule,InputNumberModule,DividerModule,InputTextModule,FormsModule,CommonModule,DropdownModule],
  templateUrl: './calculate.component.html',
  styleUrl: './calculate.component.scss'
 // providers: [NotificationService],
})
export class CalculateComponent implements OnInit {
  costs: Cost[] = [];
  allCosts: Cost[] = [];
  productCost: ProductCost[] = [
    { name: '', totalPrice: 0, totalQuantity: 1, requiredQuantity: 0 },
    { name: '', totalPrice: 0, totalQuantity: 1, requiredQuantity: 0 }
  ];
  
  constructor(
    private fb: FormBuilder,
    private costsService: CostsService,
    private titleService: Title
    //private notificationService: NotificationService
  ){
    this.titleService.setTitle('Calcular custos unitario');
  }
  ngOnInit() {
    this.getallCosts()
  }

  addIngredient() {
    this.productCost.push({ name: '', totalPrice: 0, totalQuantity: 1, requiredQuantity: 0 });
  }

  calculateIngredientCost(productCost: ProductCost) {
    return (productCost.totalPrice / productCost.totalQuantity) * productCost.requiredQuantity;
  }

  calculateTotalCost() {
    return this.productCost.reduce((total, ingredient) => {
      ingredient.unitCost = this.calculateIngredientCost(ingredient);
      return total + ingredient.unitCost;
    }, 0);
  }
  getallCosts(){
    this.costsService.getAllCosts().subscribe({
      next: (response) => {
        this.allCosts = response.data.flat();
        this.costs = this.allCosts.map(cost => {
          const date = new Date(cost.dateCost);
          const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
            return {
            ...cost, displayName: `${cost.name} ${formattedDate}`
          };
        });
      },
      error: () => {
      }
    });
  }  
  onCostSelect(index: number, selectedCost: Cost) {
    this.productCost[index].totalPrice = selectedCost.totalPrice;
    this.productCost[index].totalQuantity = parseInt(selectedCost.quantity);
  }
}
