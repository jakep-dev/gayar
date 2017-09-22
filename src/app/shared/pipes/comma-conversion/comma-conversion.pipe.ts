import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commaConversion'
})
export class CommaConversionPipe implements PipeTransform {
  addCommaRegExpression: any =  /\d{1,3}(?=(\d{3})+(?!\d))/g;

  transform(value: any, args?: any): any {
    if(value){
      return this._transformComma(value);
    }
    return null;
  }

  /**
   * 
   * @param value - passed in int or float
   */
  private _transformComma(value) {
    let position = value.indexOf('.');
    let wholeNumberPart: string;
    let fractionalPart: string;
    if (position >= 0) {
      wholeNumberPart = value.substring(0, position);
      fractionalPart = value.substring(position);
    } else {
      wholeNumberPart = value;
      fractionalPart = '';
    }
    return wholeNumberPart.toString().replace(this.addCommaRegExpression , "$&,") + fractionalPart;
  }
}
