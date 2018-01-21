import { Injectable, Inject, OnInit, Injector, ComponentRef } from '@angular/core';
import { Overlay, OverlayState, OverlayRef, ComponentPortal } from '@angular/material';

import { OverlayConfig, DEFAULT_OVERLAY_CONFIG } from 'app/model/model';
import { BusyOverlayComponent, BusyOverlayRef, COMPONENT_DATA } from 'app/shared/components/components';

/**
 * Custom injector to be used when providing custom
 * injection tokens to components inside a portal.
 * @docs-private
 */
class PortalInjector implements Injector {
    constructor(
      private _parentInjector: Injector,
      private _customTokens: WeakMap<any, any>) { }
  
    get(token: any, notFoundValue?: any): any {
      const value = this._customTokens.get(token);
  
      if (typeof value !== 'undefined') {
        return value;
      }
  
      return this._parentInjector.get<any>(token, notFoundValue);
    }
}

@Injectable()
export class OverlayService {

    constructor(
        private injector: Injector,
        private overlay: Overlay
    ) {}

    open(config: OverlayConfig = {}) {
        // Override default configuration
        const dialogConfig = { ...DEFAULT_OVERLAY_CONFIG, ...config };
    
        // Returns an OverlayRef which is a PortalHost
        const overlayRef = this.createOverlay(dialogConfig);
    
        // Instantiate remote control
        const dialogRef = new BusyOverlayRef(overlayRef);
    
        const overlayComponent = this.attachDialogContainer(overlayRef, dialogConfig, dialogRef);
    
        //overlayRef.backdropClick().subscribe(_ => dialogRef.close());
    
        return dialogRef;
      }
    
      private createOverlay(config: OverlayConfig) {
        const overlayConfig = this.getOverlayConfig(config);
        return this.overlay.create(overlayConfig);
      }
    
      private attachDialogContainer(overlayRef: OverlayRef, config: OverlayConfig, dialogRef: BusyOverlayRef) {
        const injector = this.createInjector(config, dialogRef);
    
        const containerPortal = new ComponentPortal(BusyOverlayComponent, null, injector);
        const containerRef: ComponentRef<BusyOverlayComponent> = overlayRef.attach(containerPortal);
    
        return containerRef.instance;
      }
    
      private createInjector(config: OverlayConfig, dialogRef: BusyOverlayRef): PortalInjector {
        const injectionTokens = new WeakMap();
    
        injectionTokens.set(BusyOverlayRef, dialogRef);
        injectionTokens.set(COMPONENT_DATA, config.componentData);
    
        return new PortalInjector(this.injector, injectionTokens);
      }
    
      private getOverlayConfig(config: OverlayConfig): OverlayState {
        const positionStrategy = this.overlay.position()
          .global()
          .centerHorizontally()
          .centerVertically();
    
        const overlayConfig = new OverlayState();
        overlayConfig.hasBackdrop = config.hasBackdrop;
        overlayConfig.backdropClass = config.backdropClass;
        overlayConfig.panelClass = config.panelClass;
        overlayConfig.scrollStrategy = this.overlay.scrollStrategies.block();
        overlayConfig.positionStrategy = positionStrategy;

        return overlayConfig;
      }

}