import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'btn-checkbox',
  templateUrl: 'btn-checkbox.component.html',
  styleUrls: ['./btn-checkbox.component.scss']
})
export class BtnCheckboxComponent implements OnInit {
  @Input() name: string;
  @Input() isSelected: boolean = false;
  @Input() isSubComponent: boolean = false;

  @Output() onSelectable: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {  }

  ngOnInit() {}

  toggleSelected () {
    this.isSelected = !this.isSelected;
    this.onSelectable.emit(this.isSelected);
  }
}
