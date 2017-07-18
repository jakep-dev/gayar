import { Component, OnInit, Input } from '@angular/core';
import { ACCORDION_ANIMATION } from '../animations/animations';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css'],
  animations: [ ACCORDION_ANIMATION ]
})  
export class TileComponent implements OnInit {
  @Input() title: string;
  private isContent: boolean = true;
  private arrowState: string = "up";

  private isFlipped: boolean = false;
  private isSplitted: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  toggleContent(){
    this.isContent = !this.isContent;
    this.arrowState = this.arrowState === "up" ? "down" : "up";
  }

  toggleFlip(){
      this.isFlipped = !this.isFlipped;
      this.isSplitted = false;
  }

  toggleFullScreen(){

  }

  toggleSplit(){
    this.isSplitted = !this.isSplitted;
  }
}
