import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'icon-img',
  templateUrl: './icon-img.component.html',
  styleUrls: ['./icon-img.component.scss']
})
export class IconImageComponent implements OnInit {
  @Input() imgSrc: string;
  @Input() imgAlt: string;
  @Input() btnName: string;
  @Output() onClick: EventEmitter<boolean> = new EventEmitter();

  constructor() {  }

  ngOnInit() {}

  onBtnClick () {
    this.onClick.emit();
  }
}
