import { Directive, Output, EventEmitter, HostListener, HostBinding, ElementRef } from '@angular/core';

@Directive({
  selector: '[kmbConversion]'
})
export class KmbConversionDirective {
  validNumberRegExp: string = '^[-+]?[0-9]*\.?[0-9]+$';

  @HostBinding('value') value = ''; 

  @Output('ngModelChange') valueChange = new EventEmitter<string>();

  @HostListener('keypress', ['$event']) onKeyPress(event: KeyboardEvent, el: ElementRef){
    return (event.keyCode >=48 && event.keyCode <= 57 || 
            event.keyCode === 107 || event.keyCode === 109 ||
            event.keyCode === 98 || event.keyCode === 46 || event.keyCode === 75 ||
            event.keyCode === 77 || event.keyCode === 66);
  }

  @HostListener('input', ['$event']) onInput(event: KeyboardEvent, el: ElementRef){
    let regExp = new RegExp(this.validNumberRegExp);
    const input = event.target as HTMLInputElement;
    let value = input.value;
    let splitChar = this.getSplitChar(value);
    input.value = this.computeKmbConversion(value, this.getSplitChar(value));
    this.valueChange.emit(input.value);
    return true;
  }

  private getSplitChar(value): string{
      value = value.toUpperCase();
      if(value.indexOf('K') !== -1){
        return 'K';
      }
      else if(value.indexOf('M') !== -1){
        return 'M';
      }
      else if(value.indexOf('B') !== -1){
        return 'B';
      }
      else {
        return null;
      }
  }

  /*
    Compute Kmb Conversion
  */
  private computeKmbConversion(value: string, splitChar: string) : string {
    if(!value || value.trim() === '' || !splitChar || splitChar === ''){
      return value;
    }
    let splittedVal = value.toUpperCase().split(splitChar);
    if(!splittedVal || splittedVal.length === 0){
      return '';
    }
    console.log('Float - ', splittedVal[0])

    switch(splitChar){
      case 'K':
        return (parseFloat(splittedVal[0]) * 1000).toString();

      case 'M':
        return (parseFloat(splittedVal[0]) * 1000000).toString();

      case 'B':
        return (parseFloat(splittedVal[0]) * 1000000000).toString();

      default: 
        return '';
    }

  }

  constructor() { }

}
