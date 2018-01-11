import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IReportTileModel, ISubComponentModel, ISubSubComponentModel } from 'app/model/model';


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
  @Input() isDisabled: boolean;
  @Input() subComponent: Array<ISubComponentModel> = null;

  /**
   * Helps to give the status on report tile changes.
   */
  @Output() onReportTileChange: EventEmitter<IReportTileModel> = new EventEmitter<IReportTileModel>();

  constructor() {}

  ngOnInit() { }

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

        this.isParentChecked = value;
        this.subComponent.map((child)=>{
            if(child.hasAccess) {
                if(child.subSubComponents) {
                    child.subSubComponents.map((subSub)=>{
                        return subSub.value = value;
                    });
                }
                return child.value = value;
            }
        });

        this.onReportTileChange.emit({
            id: this.id,
            value: value,
            description: this.header,
            hasAccess: !this.isDisabled,
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

    if(subComponent.subSubComponents) {
        subComponent.subSubComponents.map((child)=>{
            if(child.hasAccess) {
                return child.value = value;
            }
        });
    }
    this.executeParentChildPolicy();
  }

  /**
   * onSubSubComponentChange - Capture the sub component change event,
   * and update the subComponents and parent selection.
   *
   * @param  {boolean} value - True/False
   * @param  {ISubComponentModel} subComp: - Current Subcomponent model
   * @return {void} - No return type.
   */
  onSubSubComponentChange (value: boolean, subComp: ISubSubComponentModel) {
    if(!this.subComponent) { return; }

    let subSubComponent: ISubSubComponentModel;
    let parent: ISubComponentModel;
    
    this.subComponent.forEach(subComponent => {
        if(!subSubComponent && subComponent.subSubComponents) {
            parent = subComponent;
            subSubComponent = subComponent.subSubComponents.find(f=>f.id === subComp.id);
        }
    });

    if(!subSubComponent) { return; }

    subSubComponent.value = value;
    parent.value = parent.subSubComponents.some((sub)=> { return sub.value === true; })
    this.executeParentChildPolicy();
  }


  executeParentChildPolicy () {
    this.isParentChecked = this.subComponent.some((sub)=> { return sub.value === true; });
  }
}
