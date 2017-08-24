import { Injectable } from '@angular/core';



@Injectable()
export class MenuService {
    public isFullScreen: boolean; 
    public breadCrumbName: string;
    public containerBgColor: string = '#fafafa';
    constructor() {
      
    }
}