import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { ProductCostResponse, ProductTotalCostsResponse } from '../../../models/product-cost/product-cost-response';
import { ProductCostRequest, ProductTotalCostRequest } from '../../../models/product-cost/product-cost-request';

@Component({
  selector: 'app-calculate',
  standalone: true,
  imports: [ButtonModule,DialogCalculateComponent,InputNumberModule,ReactiveFormsModule,DividerModule,InputTextModule,FormsModule,CommonModule,DropdownModule],
  templateUrl: './calculate.component.html',
  styleUrl: './calculate.component.scss'
 // providers: [NotificationService],
})
export class CalculateComponent implements OnInit {
  @ViewChild(DialogCalculateComponent) dialogCalculateComponent!: DialogCalculateComponent;

  visibleDialog = false;
  costs: Cost[] = [];
  allCosts: Cost[] = [];
  allProductCostTotal: ProductTotalCostsResponse[] = [];
  allProductCostResponse : ProductCostResponse[] = [];
  productCostResponseTotal:  ProductTotalCostsResponse[] = [];
  productCost: ProductCostRequest[] = [
    { idCost: undefined, totalProductPrice: 0, totalQuantity: 1, quantityRequired: 0 ,ingredientCost: 0},
    { idCost: undefined, totalProductPrice: 0, totalQuantity: 1, quantityRequired: 0 ,ingredientCost: 0}
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
    this.productCostService.getAllProductCost().subscribe({
      next: (response) => {
        this.allProductCostTotal = response.data.flat();
        console.log(response.data)
      },
      error: () => {
    //    this.messageTable;
    //    this.loadingComponent.hide();
      }
    });
    console.log(this.allProductCostResponse)
  }
  
  addCost(){
    this.visibleDialog = false;
    this.getallCosts() 
  }

  newCost() {
    const payload = this.buildProductTotalCostRequest();  
    console.log(payload)
    this.productCostService.postCreateProductCost(payload).subscribe({
      next: (response) => {
        console.log('Cálculo enviado com sucesso:', response);
      },
      error: (err) => {
        console.error('Erro ao enviar os dados:', err);
      }
    });
  }
  

  addIngredient() {
    this.productCost.push({
      idCost: undefined, 
      totalProductPrice: 0,
      totalQuantity: 1,
      quantityRequired: 0,
      ingredientCost: 0,
    });
  }
  

  calculateIngredientCost(productCost: ProductCostRequest) {
    var calculate = (productCost.totalProductPrice / productCost.totalQuantity) * productCost.quantityRequired;
    return parseFloat(calculate.toFixed(2));
  }

  calculateTotalCost() {
    return this.productCost.reduce((total, ingredient) => {
      ingredient.ingredientCost = this.calculateIngredientCost(ingredient);
      return total + ingredient.ingredientCost;
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

  onCostSelect(index: number, selectedCost: any) {
    this.productCost[index].totalProductPrice = selectedCost.unitPrice;
    this.productCost[index].totalQuantity = parseInt(selectedCost.quantity);
  }
  
  
  buildProductTotalCostRequest(): ProductTotalCostRequest {
    return {
      idProduct: 1, // Substitua com o ID real do produto
      totalProductCost: this.calculateTotalCost(),
      unitCost: this.productCost.map(cost => ({
        idCost: cost.idCost,
        totalProductPrice: cost.totalProductPrice,
        totalQuantity: cost.totalQuantity,
        quantityRequired: cost.quantityRequired,
        ingredientCost: this.calculateIngredientCost(cost),
      }))
    };
  }
  
}
