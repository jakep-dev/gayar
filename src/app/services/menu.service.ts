import { Injectable } from '@angular/core';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class MenuService {
    // fullScreenSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null); 
    // breadCrumbNameSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
    // containerBgColorSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

    // set isFullScreen(value: boolean) {  this.fullScreenSubject.next(value); }
    // get isFullScreen() : boolean { return this.fullScreenSubject.value ; }

    // set breadCrumb(value: string) { this.breadCrumbNameSubject.next(value); }
    // get breadCrumb() : string { return this.breadCrumbNameSubject.value; }

    // set containerBgColor(value: string) { this.containerBgColorSubject.next(value); }
    // get containerBgColor() : string { return this.containerBgColorSubject.value; }

    isFullScreen: boolean;
    breadCrumb: string;
    containerBgColor: string;

    constructor() {
    }
}