import { Component, OnInit, Input } from '@angular/core';
import { ACCORDION_ANIMATION, SPLIT_ANIMATION } from '../animations/animations';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css'],
  animations: [ ACCORDION_ANIMATION, SPLIT_ANIMATION ]
})  
export class TileComponent implements OnInit {
  @Input() title: string;
  private isContent: boolean = true;
  private accordionState: string = "up";

  private isFlipped: boolean = false;
  private isSplitted: boolean = false;
  private splitState: string = "split";

  constructor() { }

  ngOnInit() {
  }

  toggleContent(){
    let timeout:number = 200;
    if(this.isContent){ timeout = 0; }
    setTimeout(()=>{
      this.isContent = !this.isContent; 
    }, timeout)
    this.accordionState = this.accordionState === "up" ? "down" : "up";
  }

  toggleFlip(){
      this.isFlipped = !this.isFlipped;
      this.isSplitted = false;
  }
  
  toggleFullScreen(){

  }

  toggleSplit(){
    this.isSplitted = !this.isSplitted;
    this.splitState = this.splitState === "split" ? "combine" : "split";
    console.log(this.splitState);
  }
}
