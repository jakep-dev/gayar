import { Injectable, TemplateRef } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdDialogConfig, ComponentType } from '@angular/material';

let dialogConfiguration: MdDialogConfig;

/**
 * Dialog Service to show the dialog to the user.
 */
@Injectable()
export class DialogService {
    private mdDialogRef: MdDialogRef<any>;

    constructor(private dialog: MdDialog) {}
 
    /**
     * Simple component dialog
     * @param component - component type details
     */
    public SimpleComponent (component: ComponentType<any>, afterClosed: any = null){
        if(this.mdDialogRef) { this.Dismiss(); }
        this.mdDialogRef = this.dialog.open(component, dialogConfiguration);
    }

    /**
     * Simplate Template dialog
     * @param template - template reference details
     */
    public SimpleTemplate (template: TemplateRef<any>){
        if(this.mdDialogRef) { this.Dismiss(); }
        this.mdDialogRef = this.dialog.open(template, dialogConfiguration);
    }

    /**
     * Dismiss the close dialog
     */
    public Dismiss () {
        this.mdDialogRef.close();
    }

    /**
     * Define all call backs
     * @param afterClosed - callback when dialog closes
     */
    private _defineCallBacks (afterClosed: any) {
        if(afterClosed){
            this.mdDialogRef.afterClosed().subscribe(result=>{
                afterClosed(result);
            });
        }
    }

    /**
     * Define the configuration dialog
     */
    private _configureDialog () {
        dialogConfiguration = new MdDialogConfig();
    }
}