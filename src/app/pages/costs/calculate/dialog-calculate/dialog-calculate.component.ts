import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ProductTotalCostsResponse } from '../../../../models/product-cost/product-cost-response';
import { Title } from '@angular/platform-browser';
import { ProductCostService } from '../../../../services/product-cost/product-cost.service';
@Component({
  selector: 'app-dialog-calculate',
  standalone: true,
  imports: [DialogModule,ButtonModule,InputTextModule,TableModule,CommonModule],
  templateUrl: './dialog-calculate.component.html',
  styleUrl: './dialog-calculate.component.scss'
})
export class DialogCalculateComponent implements OnInit{
  @Output() visible: boolean = false;
  @Output() addCostEvent = new EventEmitter<void>();
  @Output() editProductCost = new EventEmitter<number>();

  teste = '';
  visibleTable = false;
  allProductCostTotal: ProductTotalCostsResponse[] = [];
 
  constructor(
    private titleService: Title,
    private productCostService: ProductCostService,
  ){
    this.titleService.setTitle('Calcular custos unitário');
  }
  
  ngOnInit() {
    this.showDialog();
  }
  registeredCosts(){
    this.visibleTable = true;
    this.productCostService.getAllProductCost().subscribe({
      next: (response) => {
        this.allProductCostTotal = response.data.flat();
        console.log(this.allProductCostTotal)
      },
      error: () => {
    //    this.messageTable;
    //    this.loadingComponent.hide();
      }
    });
  }

  getProductCost(id: number){
    this.editProductCost.emit(id);
    this.visible = false;
    this.visibleTable = false;
  }

  addCost(){
    this.addCostEvent.emit(); 
    this.visible = false;
    this.visibleTable = false;
  }

  goBack(){
    this.visibleTable = false;
  }

  showDialog() {
      this.visible = true;
  }

}
