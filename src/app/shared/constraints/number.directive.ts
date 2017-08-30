import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[restrictInputNumber]'
})
export class NumberDirective {
  validNumRegExp: any = /^\d+$/;

  @HostListener('keypress', ['$event']) onKeyPressHandler(event: KeyboardEvent) {
    return (event.keyCode >=48 && event.keyCode <= 57);
  }

  @HostListener('input', ['$event']) onPasteHandler(event: KeyboardEvent) {
    let input = event.target as HTMLInputElement;
    let validNumberRegExp = new RegExp(this.validNumRegExp);
    console.log(input.value);
    if(!validNumberRegExp.test(input.value)){
      input.value = ''
    }
    return true;
  }

  constructor() { 
  }

}
