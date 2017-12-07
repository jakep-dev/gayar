
export class PDFGenerator {

    pdfContent: any = {
        pageOrientation: 'landscape',
        pageMargins: [ 8, 45, 8, 45 ]
    };

    setPageOrientation(value: string) {
        this.pdfContent.pageOrientation = value;
    }

    setPageMargin(left: number, top: number, right: number, bottom: number) {
        this.pdfContent.pageMargins = [left, top, right, bottom];
    }

    constructor() {
        this.pdfContent.styles = {};
        this.pdfContent.images = {};
    }

    addStyle(styleName: string, style: any) {
        this.pdfContent.styles[styleName] = style;
    }

    getContent(): any {
        return this.pdfContent;
    }

}