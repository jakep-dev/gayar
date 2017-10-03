import { Directive, HostListener, Input, ElementRef, Renderer } from '@angular/core';
import { SessionStorageService } from 'app/services/services';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[windowListener]'
})
export class WindowListenerDirective {
      isRefresh: boolean = false;
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
          //this.sessionStorage.clearAll();
      }

  constructor(private sessionStorage: SessionStorageService) { }

}
