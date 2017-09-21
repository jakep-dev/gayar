import { Component, OnInit, Input } from '@angular/core';

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


  isContent: boolean = true;
  isFlipped: boolean = false;
  isSplitted: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  toggleContent(){
    this.isContent = !this.isContent; 
  }

  /**
   * Toggle flip
   */
  toggleFlip(){
      this.isFlipped = !this.isFlipped;
      this.isSplitted = false;
  }
  
  /**
   * Toggle full screen
   */
  toggleFullScreen(){

  }

  /**
   * Toggle split
   */
  toggleSplit(){
    this.isSplitted = !this.isSplitted;
  }
}
