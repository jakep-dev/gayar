
export interface OverlayConfig {
    panelClass?: string;
    hasBackdrop?: boolean;
    backdropClass?: string;
    componentData?: any;
}

export const DEFAULT_OVERLAY_CONFIG: OverlayConfig = {
    hasBackdrop: true,
    backdropClass: 'dark-backdrop',
    panelClass: '',
    componentData: null
}