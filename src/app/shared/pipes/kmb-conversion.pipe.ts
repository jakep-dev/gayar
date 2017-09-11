import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kmbConversion'
})
export class KmbConversionPipe implements PipeTransform {
  removeCommaRegEx: any = /[, ]+/g;

  transform(value: string, args?: any): number {
    if(!value){
      return 0;
    }
    return this.transformFromKmb(value);
  }

  removeCommas(value){
    return value.replace(this.removeCommaRegEx, "");
  }

  transformFromKmb(value): number {
    let kmbChar = this.getKmbChar(value);
    let filteredValue = parseFloat(value.replace(/\D\.?\D/g, ''));

    switch(kmbChar){
      case 'K':
        return (filteredValue * 1000);

      case 'M':
        return (filteredValue * 1000000);

      case 'B':
        return (filteredValue * 1000000000);

      default: 
        return filteredValue;
    }
  }

  getKmbChar(value){
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

}
