import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-dialog-calculate',
  standalone: true,
  imports: [DialogModule,ButtonModule,InputTextModule,TableModule,CommonModule],
  templateUrl: './dialog-calculate.component.html',
  styleUrl: './dialog-calculate.component.scss'
})
export class DialogCalculateComponent implements OnInit{
  @Output() visible: boolean = false;
  @Output() registeredCostsEvent = new EventEmitter<void>();
  @Output() addCostEvent = new EventEmitter<void>();
  
  teste = '';
  visibleTable = false;
  ngOnInit() {
    this.showDialog();
  }
  registeredCosts(){
    this.registeredCostsEvent.emit(); 
    this.visibleTable = true;
    console.log(this.visibleTable)
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
