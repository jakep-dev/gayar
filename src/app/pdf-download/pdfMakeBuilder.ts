import { BasePage } from './pages/base.page';

export class PDFMakeBuilder {

    pdfContent: any = {
        pageOrientation: 'landscape',
        pageMargins: [ 8, 45, 8, 45 ],
        defaultStyle: {
            font: 'CenturyGothic'
        },
        content: [],
        styles: {},
        images: {},
        header: this.headerCallback.bind(this),
        footer: this.footerCallback.bind(this)
    };
    private differentFirstPage: boolean = false;

    public isDifferentFirstPage(): boolean {
        return this.differentFirstPage;
    }

    public setDifferentFirstPage(value: boolean) {
        this.differentFirstPage = value;
    }

    private firstPageHeaderStyle: any = {
        fillColor: '#464646',
        alignment: 'center',
        margin: [ 8, 7, 8, 0 ]
    };

    private firstPageHeader: any = {
        style: 'firstPageHeaderStyle',
        table: {
            widths: ['*'],
            body: [
                [
                    {
                        text: '\n\n',
                        border: [false, false, false, false]
                    }
                ]
            ]
        }
    };

    public getFirstPageHeader(): any {
        return this.firstPageHeader;
    }

    public setFirstPageHeader(header: any) {
        this.firstPageHeader = header;
    }

    private firstPageFooterStyle: any = {
        fillColor: '#464646',
        alignment: 'center',
        margin: [ 8, -12, 8, 0 ]
    };

    private firstPageFooter: any = {
        style: 'firstPageFooterStyle',
        table: {
            widths: ['*'],
            body: [
                [
                    {
                        text: '\n\n\n',
                        border: [false, false, false, false]
                    }
                ]
            ]
        }
    };

    public getFirstPageFooter(): any {
        return this.firstPageFooter;
    }

    public setFirstPageFooter(footer: any) {
        this.firstPageFooter = footer;
    }

    private defaultHeader: any = {
        text: 'Cyber OverVue Report',
        alignment: 'right',
        fontSize: 11,
        color: '#7f7f7f',
        margin: [70, 25, 70, 0]
    };

    public getDefaultPageHeader(): any {
        return this.defaultHeader;
    }

    public setDefaultPageHeader(header: any) {
        this.defaultHeader = header;
    }

    private defaultFooterStyle: any = {
        fontSize: 8,
        color: '#7f7f7f',
        margin: [ 64, 0, 60, 0 ]
    };

    private defaultFooter: any = {
        style: 'defaultFooterStyle',
        table: {
            widths: ['*', '10'],
            body: [
                [
                    {
                        text: 'For a detailed explanation of terms and analytics, please see the Appendix at the end of this report',
                        alignment: 'center',
                        border: [false, true, false, false]
                    },
                    {
                        text: 0,
                        alignment: 'right',
                        border: [false, false, false, false]
                    }
                ]
            ]
        }
    };

    public getDefaultPageFooter(): any {
        return this.defaultFooter;
    }

    public setDefaultPageFooter(footer: any) {
        this.defaultFooter = footer;
    }

    private headerCallback(currentPage: number, pageCount: number): any {
        if(this.differentFirstPage && (currentPage == 1)) {
            return this.firstPageHeader;
        } else {
            return this.defaultHeader;
        }
    }

    private footerCallback(currentPage: number, pageCount: number): any {
        if(this.differentFirstPage && (currentPage == 1)) {
            return this.firstPageFooter;
        } else {
            this.defaultFooter.table.body[0][1].text = currentPage;
            return this.defaultFooter;
        }
    }

    public setPageOrientation(value: string) {
        this.pdfContent.pageOrientation = value;
    }

    public getPageMargins(): number[] {
        return this.pdfContent.pageMargins;
    }
    public setPageMargins(left: number, top: number, right: number, bottom: number) {
        this.pdfContent.pageMargins = [left, top, right, bottom];
    }

    constructor() {
        this.addHeaderFooterStyles();
    }

    private addHeaderFooterStyles() {
        this.pdfContent.styles['firstPageHeaderStyle'] = this.firstPageHeaderStyle;
        this.pdfContent.styles['firstPageFooterStyle'] = this.firstPageFooterStyle;
        this.pdfContent.styles['defaultFooterStyle'] = this.defaultFooterStyle;
    }

    public addStyle(styleName: string, style: any) {
        this.pdfContent.styles[styleName] = style;
    }

    public addStyles(styles: Array<any>) {
        for(let styleName in styles) {
            this.pdfContent.styles[styleName] = styles[styleName];
        }
    }

    public clearStyles() {
        for(let styleName in this.pdfContent.styles) {
            delete this.pdfContent.styles[styleName];
        }
        this.addHeaderFooterStyles();
    }

    public addImage(imageLabel: string, dataUrl: string) {
        this.pdfContent.images[imageLabel] = dataUrl;
    }

    public addImages(images: Array<string>) {
        for(let imageLabel in images) {
            this.pdfContent.images[imageLabel] = images[imageLabel];
        }
    }

    public clearImages() {
        for(let imageLabel in this.pdfContent.images) {
            delete this.pdfContent.images[imageLabel];
        }
        //this.pdfContent.images = {};
    }
    
    public getContent(): any {
        return this.pdfContent;
    }

    public addPdfContent(pdfTextBlocks: Array<any>) {
        pdfTextBlocks.forEach(pdfTextBlock => {
            this.pdfContent.content.push(pdfTextBlock);
        });
    }

    public clearPdfContent() {
        this.pdfContent.content.length = 0;
    }

    public addPage(page: BasePage) {
        this.addImages(page.getImages());
        this.addStyles(page.getStyles());
        this.addPdfContent(page.getPdfContent());
    }
}