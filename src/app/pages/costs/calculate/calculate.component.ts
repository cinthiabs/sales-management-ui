import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ProductsService } from '../../../services/products/products.service';
import { Product } from '../../../models/products/products';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-calculate',
  standalone: true,
  imports: [ButtonModule,
            ToastModule,
            DialogCalculateComponent,
            DialogModule,
            InputNumberModule,
            ReactiveFormsModule,
            DividerModule,
            InputTextModule,
            FormsModule,
            CommonModule,
            DropdownModule],
  templateUrl: './calculate.component.html',
  styleUrl: './calculate.component.scss',
  providers: [NotificationService,MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class CalculateComponent implements OnInit {
  @ViewChild(DialogCalculateComponent) dialogCalculateComponent!: DialogCalculateComponent;
  selectedProductCostId: number | null = null;
  formProductCost: FormGroup;
  
  visibleDialog = false;
  visibleDialogProduct = false; 
  costs: Cost[] = [];
  allCosts: Cost[] = [];
  products: Product[] = [];
  allProductCostTotal: ProductTotalCostsResponse[] = [];
  allProductCostResponse : ProductCostResponse[] = [];
  productCostResponseTotal:  ProductTotalCostsResponse[] = [];
  productCost: ProductCostRequest[] = [
    { idCost: undefined, totalProductPrice: 0, totalQuantity: 1, quantityRequired: 0 ,ingredientCost: 0}
  ];
  selectedCostId = 0; 
  selectedProductId = 0;
  message = false;
  loadingButton = false;

  constructor(
    private fb: FormBuilder,
    private costsService: CostsService,
    private titleService: Title,
    private productCostService: ProductCostService,
    private productService: ProductsService,
    private notificationService: NotificationService
  ){
    this.titleService.setTitle('Calcular custos unitário');
    
    this.formProductCost = this.fb.group({
      idCost: [null],
      totalProductPrice: [0],
      totalQuantity: [1],
      quantityRequired: [0],
      ingredientCost: [0],
    });
  }
  ngOnInit() {
    this.dialogCalculateComponent
    this.visibleDialog = true;
  }

  onEditProductCost(id: number) {
    this.selectedProductCostId = id;
  
    this.productCostService.getByIdProductCost(id).subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          // Encontra o objeto correto no array `data` com base no ID
          const productTotalCost = response.data.find(item => item.idProductTotalCost === id);
          
          if (productTotalCost) {
            const productCost = productTotalCost.productCost[0]; // Obtém o primeiro item do array `productCost`
            
            this.formProductCost.patchValue({
              idCost: productCost.idCost,
              totalProductPrice: productCost.totalProductPrice,
              totalQuantity: productCost.totalQuantity,
              quantityRequired: productCost.quantityRequired,
              ingredientCost: productCost.ingredientCost,
            });
  
            this.visibleDialog = true; // Exibe o diálogo de edição
          } else {
            this.notificationService.showErrorToast('Custo do produto não encontrado.');
          }
        }
      },
      error: () => {
        this.notificationService.showErrorToast('Erro ao carregar os dados para edição.');
      },
    });
  }
    
  
  addCost(){
    this.visibleDialog = false;
    this.getallCosts() 
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

  onCostSelect(index: number, selectedCostId: number): void {
    const selectedCost = this.costs.find(cost => cost.id === selectedCostId);
    if (selectedCost) {
      this.productCost[index].idCost = selectedCost.id;
      this.productCost[index].totalProductPrice = selectedCost.unitPrice;
      this.productCost[index].totalQuantity = parseInt(selectedCost.quantity, 10);
    }
  }
  
  buildProductTotalCostRequest(productId: number): ProductTotalCostRequest {
    return {
      idProduct: productId,
      totalProductCost: this.calculateTotalCost(),
      unitCost: this.productCost.map(cost => ({
        idCost: cost.idCost,
        totalProductPrice: cost.totalProductPrice,
        totalQuantity: cost.totalQuantity,
        quantityRequired: cost.quantityRequired,
        ingredientCost: cost.ingredientCost,
      }))
    };
  }

  openDialog(){
    this.visibleDialogProduct = true;
    this.getAllProducts();
  }

  getAllProducts(){
    this.productService.getAllProducts().subscribe({
      next:(response) => {
        this.products = response.data;
      },
      error: () => {
        this.notificationService.showErrorToast('Erro ao carregar os dados de produto');
      }
    })
  }

  newProductCost() {
    if (!this.selectedProductId) {
      this.message = true;
      return;
    }
    this.message = false;
    this.loadingButton = true;
    const payload = this.buildProductTotalCostRequest(this.selectedProductId);  

    this.productCostService.postCreateProductCost(payload).subscribe({
      next: () => {
        this.loadingButton = false;
        this.notificationService.showSuccessToast('Cálculo cadastrado com sucesso!')
        this.visibleDialogProduct = false;
      },
      error: () => {
        this.notificationService.showErrorToast('Erro ao enviar os dados de cadastro');
        this.loadingButton = false;
      }
    });
  }
  onDropdownChange(selectedValue: number, index: number): void {
    this.productCost[index].idCost = selectedValue; // Atualiza o valor no array
  }
}
