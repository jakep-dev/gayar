import { Injectable } from '@angular/core';
import { MdSnackBar, MdSnackBarConfig, ComponentType, MdSnackBarRef } from '@angular/material';

let snackBarConfiguration: MdSnackBarConfig;

/**
 * SnackBar Service to show the notifiation to the user.
 */
@Injectable()
export class SnackBarService {
    private snackBarRef: MdSnackBarRef<any>;
    

    constructor(private snackBar: MdSnackBar) {
        this._configureSnackBar();
    }
    
    /**
     * Show the simple snack bar.
     * @param message - Message to display on snack bar.
     * @param action  - Action to display on snack bar.
     */
    public Simple (message: string, action: string = '', 
                   afterDismissed: any = null, afterOpened: any = null, onAction: any = null) {
        if(this.snackBarRef){ this.Dismiss(); }
        this.snackBarRef = this.snackBar.open(message, action, snackBarConfiguration);
        this._defineCallBacks(afterDismissed, afterOpened, onAction);
    }

    /**
     * Dismiss the current displayed snack bar
     */
    public Dismiss(){
        this.snackBar.dismiss();
    }

    /**
     * Show the custom snack bar based on passed in component
     * @param component - Pass the component detail
     */
    public Custom (component: ComponentType<any>,
                   afterDismissed: any = null, afterOpened: any = null, onAction: any = null) {
        if(this.snackBarRef){ this.Dismiss(); }
        this.snackBar.openFromComponent(component, snackBarConfiguration);
        this._defineCallBacks(afterDismissed, afterOpened, onAction);
    }

    /**
     * 
     * @param afterDismissed 
     * @param afterOpened 
     * @param onAction 
     */
    private _defineCallBacks (afterDismissed: any = null, afterOpened: any = null, onAction: any = null) {
        if(afterDismissed) {
            this.snackBarRef.afterDismissed().subscribe(()=>{
                afterDismissed();
            });
        }

        if(afterOpened) {
            this.snackBarRef.afterDismissed().subscribe(()=>{
                afterOpened();
            });
        }

        if(onAction) {
            this.snackBarRef.onAction().subscribe(()=>{
                onAction();
            });
        }
    }

    /**
     * Configure the snack bar, if a configuration is injected then use that 
     * otherwise use the default configuration
     */
    private _configureSnackBar () {
        snackBarConfiguration = new MdSnackBarConfig();
        snackBarConfiguration.duration = 4000;
        snackBarConfiguration.politeness = "off";
    }
}