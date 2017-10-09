import { Injectable } from '@angular/core';

@Injectable()
export class MenuService {
    isFullScreen: boolean;
    breadCrumb: string;
    containerBgColor: string;
    appTileComponents: Array<any>;

    constructor() {
      this.appTileComponents = new Array<any>();
    }
}
