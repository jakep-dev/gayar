import canvg from 'new-canvg';
import pdfMake from 'pdfmake/build/pdfmake';

export const canvasFactory = canvg;

// Avoid to reloading of fonts
export var pdfMakeInstance = null;

export function getPdfMake(fontFiles: any, fontNames: any) {
    if (!pdfMakeInstance) {
        pdfMake.vfs = fontFiles;
        pdfMake.fonts = fontNames;
        pdfMakeInstance = pdfMake;
        console.log(pdfMakeInstance);
    }
    return pdfMakeInstance;
}

