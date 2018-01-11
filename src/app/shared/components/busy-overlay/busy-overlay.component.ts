import { Component, Input, Inject, InjectionToken } from '@angular/core';
import { BusyOverlayRef } from './busy-overlay-ref';

export const COMPONENT_DATA = new InjectionToken<any>('COMPONENT_DATA');

@Component({
    selector: 'busy-overlay',
    templateUrl: './busy-overlay.component.html',
    styleUrls: ['./busy-overlay.component.scss']
})
export class BusyOverlayComponent {

    constructor(
        public dialogRef: BusyOverlayRef,
        @Inject(COMPONENT_DATA) public message: any) { }
}
