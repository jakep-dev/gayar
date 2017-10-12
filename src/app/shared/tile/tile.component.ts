import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() showProgress: boolean = false;

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


  isContent:    boolean = true;
  isFlipped:    boolean = false;
  isSplitted:   boolean = false;
  isMaximize:   boolean = false;
  isTileVisible: boolean = true;

  constructor(private menuService: MenuService) { }

  ngOnInit() {
    this.menuService.appTileComponents.push(this);
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
      console.log(this.menuService.appTileComponents);
      this.menuService.appTileComponents.forEach(tile => {
          if (tile.id !== this.id) {
            tile.isTileVisible = this.isMaximize;
          }
      });
      this.isMaximize = !this.isMaximize;
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
}
