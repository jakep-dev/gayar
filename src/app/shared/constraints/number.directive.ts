import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[restrictInputNumber]'
})
export class NumberDirective {
  @HostListener('keypress', ['$event']) onKeyPressHandler(event: KeyboardEvent) {
    if(event.keyCode >=48 && event.keyCode <= 57){
      return true;
    }
    else{
      return false;
    }
  }

  constructor() { 
  }

}
