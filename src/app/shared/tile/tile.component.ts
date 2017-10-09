import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css'],
  animations: [  ]
})
export class TileComponent implements OnInit {
  @Input() title: string;
  @Input() isSplittable: boolean = false;
  @Input() isAccordion: boolean = true;
  @Input() isFlippable: boolean = false;
  @Input() isFullScreen: boolean = true;
  @Input() showProgress: boolean = false;


  /**
   * Fires when flip happens.
   */
  @Output() onFlipEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Fires when split happens.
   */
  @Output() onSplitEvent: EventEmitter<boolean> = new EventEmitter<boolean>();


  isContent: boolean = true;
  isFlipped: boolean = false;
  isSplitted: boolean = false;

  constructor() { }

  ngOnInit() {
  }


  /**
   * toggleContent - Toggle content expand/collapse
   *
   * @return {type}  description
   */
  toggleContent(){
    this.isContent = !this.isContent;
  }

  /**
   * Toggle flip screen and fires the event accordingly.
   */
  toggleFlip(){
      this.isFlipped = !this.isFlipped;
      this.isSplitted = false;
      this.onFlipEvent.emit(this.isFlipped);
  }

  /**
   * Toggle full screen
   */
  toggleFullScreen(){

  }

  /**
   * Toggle split screen and fires the event accordingly.
   */
  toggleSplit(){
    this.isSplitted = !this.isSplitted;
    this.onSplitEvent.emit(this.isSplitted);
  }
}
