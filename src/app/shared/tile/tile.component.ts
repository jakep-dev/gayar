import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { MenuService } from 'app/services/services';
import { FLIP_ANIMATION, SPLIT_ANIMATION, FLYINOUT_ANIMATION } from 'app/shared/animations/animations';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
  animations: [ FLIP_ANIMATION, SPLIT_ANIMATION, FLYINOUT_ANIMATION ]
})
export class TileComponent implements OnInit {
  @Input() id: string;
  @Input() title: string;
  @Input() isSplittable: boolean = false;
  @Input() isAccordion: boolean = true;
  @Input() isFlippable: boolean = false;
  @Input() isFullScreen: boolean = true;
  @Input() isDragable: boolean = false;
  @Input() isSelectable: boolean = false;
  @Input() showProgress: boolean = false;
  @Input() isSelected: boolean = false;
  @Input() isSelectableDisabled: boolean = false;
  @Input() maximize:  boolean = false;

  /**
   * Fires on flip.
   */
  @Output() onFlip: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Fires on split.
   */
  @Output() onSplit: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Fires on fullscreen.
   */
  @Output() onFullScreen: EventEmitter<boolean> = new EventEmitter<boolean>();


  /**
   * Fires on checkbox selection
   */
  @Output() onSelectable: EventEmitter<boolean> = new EventEmitter<boolean>();


  isContent:    boolean = true;
  isFlipped:    boolean = false;
  isSplitted:   boolean = false;
  isMaximize:   boolean = false;
  isTileVisible: boolean = true;

  constructor(private menuService: MenuService,
              private element: ElementRef) {
  }

  ngOnInit() {
    this.menuService.appTileComponents.push(this);
    this.setMaximize();
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
      this.onFlip.emit(this.isFlipped);
  }

  /**
   * Toggle full screen
   */
  toggleFullScreen(){
      this.menuService.appTileComponents.forEach(tile => {
          if (tile.id !== this.id) {
            tile.isTileVisible = this.isMaximize;
          }
      });
      this.isMaximize = !this.isMaximize;
      this.isAccordion = !this.isMaximize;
      this.isContent = true;
      this.menuService.isFullScreen = this.isMaximize;
      this.onFullScreen.emit(this.isMaximize);
  }

  /**
   * Toggle split screen and fires the event accordingly.
   */
  toggleSplit(){
    this.isSplitted = !this.isSplitted;
    this.onSplit.emit(this.isSplitted);
  }


  /**
   * toggleSelected - description
   *
   * @return {type}  description
   */
  toggleSelected () {
    this.isSelected = !this.isSelected;
    this.onSelectable.emit(this.isSelected);
  }
  /**
   * set the chart size in maximize mode
   *   
   */
  setMaximize(){
    if(this.maximize){
      this.isMaximize = true;
    }
  }
}
