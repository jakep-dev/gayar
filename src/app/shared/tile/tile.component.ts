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
  accordionState: string = "up";
  isFlipped: boolean = false;
  isSplitted: boolean = false;
  splitState: string = "split";

  constructor() { }

  ngOnInit() {
  }

  toggleContent(){
    this.isContent = !this.isContent; 
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
