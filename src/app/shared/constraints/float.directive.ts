import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[restrictInputFloat]'
})
export class FloatDirective {

   //Determine only digits
   validFloatRegExp: any = /^\d+?.\d*$/;
   validNumberRegExp: any = /^\d+$/;
   
     /**
      * Event emits on keypress
      * @param event
      */
     @HostListener('keypress', ['$event']) onKeyPressHandler(event: KeyboardEvent) {
       console.log(event.keyCode);
       return (event.keyCode >=48 && event.keyCode <= 57 || event.keyCode === 46);
     }
   
     /**
      * Event emits on textbox input
      * @param event 
      */
     @HostListener('input', ['$event']) onPasteHandler(event: KeyboardEvent) {
       let input = event.target as HTMLInputElement;
       let validateNum = new RegExp(this.validNumberRegExp);
       let validateFloat = new RegExp(this.validFloatRegExp);

       if(!validateNum.test(input.value) && !validateFloat.test(input.value)){
         input.value = this.getValidNumber(input.value);
       }
       return true;
     }

     getValidNumber(value: string): string{
       let totalLength = value.length;
       if(totalLength < 0){
         return '';
       }

       return value.slice(0, totalLength - 1);
     }
   
     constructor() { 
     }
   

}
