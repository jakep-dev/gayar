import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[restrictInputNumber]'
})
export class NumberDirective {
  @HostListener('keypress', ['$event']) onKeyPressHandler(event: KeyboardEvent) {
    return (event.keyCode >=48 && event.keyCode <= 57);
  }

  constructor() { 
  }

}
