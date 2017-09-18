import { Directive, ElementRef, Input } from '@angular/core';

@Directive({ selector: '[myHighlight]' })
export class HighlightDirective {
    constructor() {
       //el.nativeElement.style.backgroundColor = 'yellow';
    }
}