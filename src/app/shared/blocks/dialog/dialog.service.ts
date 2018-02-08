import { Injectable, TemplateRef } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdDialogConfig, ComponentType } from '@angular/material';

/**
 * Dialog Service to show the dialog to the user.
 */
@Injectable()
export class DialogService {
    private mdDialogRef: MdDialogRef<any>;

    private dialogConfiguration: MdDialogConfig;

    constructor(private dialog: MdDialog) {
        this.dialogConfiguration = new MdDialogConfig();
    }
 
    /**
     * Simple component dialog
     * @param component - component type details
     */
    public SimpleComponent (component: ComponentType<any>, dialogConfig: MdDialogConfig, afterClosed: any = null){
        if(this.mdDialogRef) { this.Dismiss(); }

        //merge configuration settings
        this.dialogConfiguration = { ...this.dialogConfiguration, ...dialogConfig };

        this.mdDialogRef = this.dialog.open(component, this.dialogConfiguration);
        this._defineCallBacks(afterClosed);
    }

    /**
     * Simplate Template dialog
     * @param template - template reference details
     */
    public SimpleTemplate (template: TemplateRef<any>){
        if(this.mdDialogRef) { this.Dismiss(); }
        this.mdDialogRef = this.dialog.open(template, this.dialogConfiguration);
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

}
