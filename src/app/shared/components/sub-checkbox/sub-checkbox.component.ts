import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubComponent } from 'app/model/report.model';

@Component({
  selector: 'sub-checkbox',
  templateUrl: 'sub-checkbox.component.html',
  styleUrls: ['./sub-checkbox.component.scss']
})
export class SubCheckboxComponent implements OnInit {
  @Input() headerName: string;
  @Input() subComponents: Array<SubComponent>;
  @Input() hasAllSelected: boolean;


  /**
   * Get the overall status of the selection.
   */
  @Output() onOverAllSelectionStatus: EventEmitter<boolean> = new EventEmitter<boolean>();


  /**
   * Get the Individual sub component
   */
  @Output() onIndividualSubComponentChange: EventEmitter<SubComponent> = new EventEmitter<SubComponent>();


  /**
   * Get all components details
   */
  @Output() onAllSubComponents: EventEmitter<Array<SubComponent>> = new EventEmitter<Array<SubComponent>>();

  constructor() {  }

  ngOnInit() {

  }


  /**
   * onHeaderSelection - Helps to select and deselect all sub components
   *
   * @param  {type} value - Holds the actual value of header selection.
   */
  onHeaderSelection (value) {
    if(!this.subComponents) {
      return;
    }
    this.subComponents.map(r=>{
      return r.value = value;
    });
    this.onOverAllSelectionStatus.emit(value);
    this.onAllSubComponents.emit(this.subComponents);
  }

  onSubComponentSelection (value, subComponent: SubComponent) {
    subComponent.value = value;
    this.onIndividualSubComponentChange.emit(subComponent);
    this.onAllSubComponents.emit(this.subComponents);
  }
}
