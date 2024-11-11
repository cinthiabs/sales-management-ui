import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { DialogCalculateComponent } from './dialog-calculate/dialog-calculate.component';
import { ProductCostService } from '../../../services/product-cost/product-cost.service';
import { ProductTotalCostsResponse } from '../../../models/product-cost/product-cost-response';

@Component({
  selector: 'app-calculate',
  standalone: true,
  imports: [ButtonModule,DialogCalculateComponent,InputNumberModule,DividerModule,InputTextModule,FormsModule,CommonModule,DropdownModule],
  templateUrl: './calculate.component.html',
  styleUrl: './calculate.component.scss'
 // providers: [NotificationService],
})
export class CalculateComponent implements OnInit {
  @ViewChild(DialogCalculateComponent) dialogCalculateComponent!: DialogCalculateComponent;

  visibleDialog = false;
  costs: Cost[] = [];
  allCosts: Cost[] = [];
  allProductCost: ProductTotalCostsResponse[] = [];
  productCostResponse:  ProductTotalCostsResponse[] = [];
  productCost: ProductCost[] = [
    { name: '', totalPrice: 0, totalQuantity: 1, requiredQuantity: 0 },
    { name: '', totalPrice: 0, totalQuantity: 1, requiredQuantity: 0 }
  ];
  
  constructor(
    private fb: FormBuilder,
    private costsService: CostsService,
    private titleService: Title,
    private productCostService: ProductCostService
   // private notificationService: NotificationService
  ){
    this.titleService.setTitle('Calcular custos unitário');
  }
  ngOnInit() {
    this.dialogCalculateComponent
    this.visibleDialog = true;
    //this.getallCosts()
  }

  registeredCosts(){   
    console.log('aqui') 
    this.productCostService.getAllProductCost().subscribe({
      next: (response) => {
        this.allProductCost = response.data.flat();
      },
      error: () => {
    //    this.messageTable;
    //    this.loadingComponent.hide();
      }
    });
    console.log(this.allProductCost)
  }
  
  addCost(){
    this.visibleDialog = false;
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
      }
    });
  } 

  onCostSelect(index: number, selectedCost: Cost) {
    this.productCost[index].totalPrice = selectedCost.totalPrice;
    this.productCost[index].totalQuantity = parseInt(selectedCost.quantity);
  }
}
