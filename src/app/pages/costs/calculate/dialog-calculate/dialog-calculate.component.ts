import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-dialog-calculate',
  standalone: true,
  imports: [DialogModule,ButtonModule,InputTextModule],
  templateUrl: './dialog-calculate.component.html',
  styleUrl: './dialog-calculate.component.scss'
})
export class DialogCalculateComponent implements OnInit{
  @Output() visible: boolean = false;
  @Output() registeredCostsEvent = new EventEmitter<void>();
  @Output() addCostEvent = new EventEmitter<void>();
  
  ngOnInit() {
    this.showDialog();
  }
  registeredCosts(){
    this.registeredCostsEvent.emit(); 
  }
  addCost(){
    this.addCostEvent.emit(); 
    this.visible = false;
  }

  showDialog() {
      this.visible = true;
  }
}
