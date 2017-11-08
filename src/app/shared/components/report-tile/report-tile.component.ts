import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IReportTileModel, ISubComponentModel } from 'app/model/model';


/**
 * Report Tile is a generic tile helps to load the report html
 */
@Component({
  selector: 'report-tile',
  templateUrl: 'report-tile.component.html',
  styleUrls: ['./report-tile.component.scss'],
})
export class ReportTileComponent implements OnInit {
  @Input() isParentChecked: boolean;
  @Input() id: string;
  @Input() header: string;
  @Input() subComponent: Array<ISubComponentModel> = null;

  /**
   * Helps to give the status on report tile changes.
   */
  @Output() onReportTileChange: EventEmitter<IReportTileModel> = new EventEmitter<IReportTileModel>();

  constructor() {}

  ngOnInit() {}

  onChildChange (child) {

  }

  /**
   * onParentChange - Capture the parent change event,
   * and also update the child components accordingly,
   * If parent component is selected all child are selected and vice-versa,
   * Emits the onReportTileChange for status.
   *
   * @param  {boolean} value - True/false.
   * @return {void} - No return value.
   */
  onParentChange (value: boolean) {
    if (!this.subComponent) {
      return;
    }

    this.subComponent.map((child)=>{
      return child.value = value;
    });

    this.onReportTileChange.emit({
      id: this.id,
      value: value,
      description: this.header,
      subComponents: null
    })
  }


  /**
   * onSubComponentChange - Capture the sub component change event,
   * and update the subComponents and parent selection.
   *
   * @param  {boolean} value - True/False
   * @param  {ISubComponentModel} subComp: - Current Subcomponent model
   * @return {void} - No return type.
   */
  onSubComponentChange (value: boolean, subComp: ISubComponentModel) {
    if(!this.subComponent) { return; }

    let subComponent = this.subComponent.find(f=>f.id === subComp.id);
    if(!subComponent) { return;}

    subComponent.value = value;
    this.executeParentChildPolicy();
  }

  executeParentChildPolicy () {
    this.isParentChecked = this.subComponent.every((sub)=> { return sub.value === true; })
  }
}
