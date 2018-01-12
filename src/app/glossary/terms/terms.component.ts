import { Component, OnInit, Input, ViewEncapsulation, ElementRef } from '@angular/core';

@Component({
  selector: 'glossary-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class TermsComponent implements OnInit {
  @Input() term: any;
  hasLink: boolean = false;

  ngOnInit() {
    this.getTypeOfTerms();
  }

  constructor() {
  }

  getTypeOfTerms(){
    if(this.term.subComponents){
      this.term.subComponents.forEach(list => {
        if(list.type && list.type == "C" &&
          this.term.link && this.term.link !== null){
          this.hasLink = true;
        }
      });
    }
  }
}
