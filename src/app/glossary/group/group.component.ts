import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'glossary-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})

export class GroupComponent implements OnInit {

  @Input() letter: string;
  @Input() terms: any;
  constructor() { }

  ngOnInit() {
  }

  
}
