import { Injectable } from '@angular/core';

@Injectable()
export class MenuService {
    isFullScreen: boolean;
    breadCrumb: string;
    containerBgColor: string;

    constructor() {
    }
}
