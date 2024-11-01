import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProductCost } from '../../../models/costs/product-cost';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-calculate',
  standalone: true,
  imports: [ButtonModule,InputNumberModule,DividerModule,InputTextModule,FormsModule,CommonModule,DropdownModule],
  templateUrl: './calculate.component.html',
  styleUrl: './calculate.component.scss'
})
export class CalculateComponent {

  productCost: ProductCost[] = [];

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
  
}
