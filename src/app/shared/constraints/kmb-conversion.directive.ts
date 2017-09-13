import { Directive, Output, EventEmitter, HostListener, HostBinding, ElementRef } from '@angular/core';

@Directive({
  selector: '[kmbConversion]'
})
export class KmbConversionDirective {
  validKmbRegExpression: any = /^[-+]?[0-9]*\.?[0-9]+([KMB|kmb])?$/;
  removeCommaRegExpression: any = /[, ]+/g;
  addCommaRegExpression: any =  /\d{1,3}(?=(\d{3})+(?!\d))/g;

  @HostBinding('value') value = ''; 

  @Output('ngModelChange') valueChange = new EventEmitter<string>();

  @HostListener('keypress', ['$event']) onKeyPress(event: KeyboardEvent, el: ElementRef){
    console.log(event);
    return (event.charCode >=48 && event.charCode <= 57 || 
            event.charCode === 107 || event.charCode === 109 ||
            event.charCode === 98 || event.charCode === 46 || event.charCode === 75 ||
            event.charCode === 77 || event.charCode === 66);
  }

  @HostListener('input', ['$event']) onInput(event: KeyboardEvent){
    let regExp = new RegExp(this.validKmbRegExpression);
    const input = event.target as HTMLInputElement;
    let value = input.value;
    let splitChar = this.checkForKmbConversion(value);
    if(!splitChar){
      input.value = this.computeCommas(input.value);
      return true;
    }
    input.value = this.computeKmbConversion(value, splitChar);
    return true;
  }

  /**
   * Checks for KMB Conversion
   * @param value 
   */
  private checkForKmbConversion (value): string{
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

  /**
   * Compute the value with comma separated.
   * @param value 
   */
  private computeCommas (value) : string {
    let floatNumber: any = value.replace(this.removeCommaRegExpression, "");
    if(isNaN(floatNumber)){
      return '';
    }
    return floatNumber.toString().replace(this.addCommaRegExpression , "$&,");
  } 

  /*
    Compute Kmb Conversion
  */
  private computeKmbConversion(value: string, splitChar: string) : string {
    if(!value || value.trim() === '' || !splitChar || splitChar === ''){
      return value;
    }
    let splittedVal = value.toUpperCase().split(splitChar);
    if(!splittedVal || splittedVal.length === 0 || 
       (splittedVal.length > 0 && splittedVal[0].trim() === '')){
      return '';
    }
    
    let floatNumber: any = parseFloat(splittedVal[0].replace(this.removeCommaRegExpression, ""));
    if(isNaN(floatNumber)){
      return '';
    }

    switch(splitChar){
      case 'K':
        return (floatNumber * 1000).toString().replace(this.addCommaRegExpression , "$&,");

      case 'M':
        return (floatNumber * 1000000).toString().replace( this.addCommaRegExpression , "$&,");

      case 'B':
        return (floatNumber * 1000000000).toString().replace( this.addCommaRegExpression , "$&,");

      default: 
        return '';
    }

  }

  constructor() { }

}
