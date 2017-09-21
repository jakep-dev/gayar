import { Directive, HostListener } from '@angular/core';
import { SessionStorageService } from 'app/services/services';
import { DOCUMENT } from '@angular/common'; 

@Directive({
  selector: '[windowListener]'
})
export class WindowListenerDirective {
  /**
      * Event emits on keypress
      * @param event
      */
      @HostListener('window:beforeunload', ['$event']) 
      beforeunloadHandler(event) {
      
      }

      @HostListener('window:unload', ['$event'])
      unloadHandler(event){
        
      }

      @HostListener('window:load', ['$event'])
      loadHandler(event){
        
      }

  constructor() { }

}