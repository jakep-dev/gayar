import * as canvg from 'new-canvg';
import * as pdfMake from 'pdfmake/build/pdfmake.min';

export const canvasFactory = canvg;

// Avoid to reloading of fonts
export var pdfMakeInstance = null;
export var textToolsInstance = null;

export function getPdfMake(fontFiles: any, fontNames: any) {
    if (!pdfMakeInstance) {
        pdfMake.vfs = fontFiles;
        pdfMake.fonts = fontNames;
        pdfMakeInstance = pdfMake;
        //console.log(pdfMakeInstance);
    }
    return pdfMakeInstance;
}

