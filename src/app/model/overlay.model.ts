
export interface OverlayConfig {
    panelClass?: string;
    hasBackdrop?: boolean;
    backdropClass?: string;
    componentData?: any;
}

export const DEFAULT_CONFIG: OverlayConfig = {
    hasBackdrop: true,
    backdropClass: 'dark-backdrop',
    panelClass: 'tm-file-preview-dialog-panel',
    componentData: null
}