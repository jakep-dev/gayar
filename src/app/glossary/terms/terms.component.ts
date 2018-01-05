import { Component, OnInit, Input, ViewEncapsulation, ElementRef } from '@angular/core';

@Component({
  selector: 'glossary-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class TermsComponent implements OnInit {
  @Input() term: any;
  childList : any;
  bulletList : any;

  ngOnInit() {
    this.getTypeOfTerms();
  }

  constructor() {
  }

  getTypeOfTerms(){
    if(this.term.subComponents){
      this.term.subComponents.forEach(list => {
        switch (list.type) {
          case "B":
            list.term = null;
            this.bulletList = this.term.subComponents;
          break;
          case "C":
            this.childList = this.term.subComponents;
            break;

          default:
            break;
        }
      });
    }
  }
}
