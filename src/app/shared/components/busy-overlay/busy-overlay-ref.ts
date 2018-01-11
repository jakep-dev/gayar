import { OverlayRef } from '@angular/material';

export class BusyOverlayRef {

    constructor(private overlayRef: OverlayRef) { }

    close(): void {
        this.overlayRef.dispose();
    }
}