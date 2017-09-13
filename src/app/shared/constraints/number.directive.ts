import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[restrictInputNumber]'
})
export class NumberDirective {
  //Determine only digits
  validNumRegExp: any = /^\d+$/;

  /**
   * Event emits on keypress
   * @param event 
   */
  @HostListener('keypress', ['$event']) onKeyPressHandler(event: KeyboardEvent) {
    return (event.charCode >=48 && event.charCode <= 57);
  }

  /**
   * Event emits on textbox input
   * @param event 
   */
  @HostListener('input', ['$event']) onPasteHandler(event: KeyboardEvent) {
    let input = event.target as HTMLInputElement;
    let validNumberRegExp = new RegExp(this.validNumRegExp);
    if(!validNumberRegExp.test(input.value)){
      let filteredValue = input.value.replace(/\D/g, '');
      input.value = filteredValue || '';
    }
    return true;
  }

  constructor() { 
  }

}
