import { Component, OnInit, Input, ViewEncapsulation, ElementRef } from '@angular/core';

@Component({
  selector: 'glossary-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class TermsComponent implements OnInit {
  @Input() term: any;

  ngOnInit() {
  }

  constructor() {
  }
}
