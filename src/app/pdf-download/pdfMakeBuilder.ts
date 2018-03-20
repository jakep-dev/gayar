import { BasePage } from './pages/base.page';

export class PDFMakeBuilder {

    //inital json object representing a blank pdf
    //uses Century Gothic font and landscape pages as defaults
    private pdfContent: any = {
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

    //boolean to indicate if current pdf needs a specific header 
    //and footer for first page only
    //subsequent pages uses a different header and footer
    //defaults to all pages use the same header and footer
    private differentFirstPage: boolean = false;

    /**
     * get boolean value to indicate if the first page header and 
     * footer is different from subsequent pages
     * 
     * @public
     * @function isDifferentFirstPage
     * @return {boolean} - true if first page has different header and footer from subsequent pages, otherwise false
     */
    public isDifferentFirstPage(): boolean {
        return this.differentFirstPage;
    }

    /**
     * set boolean value to indicate if the first page header and 
     * footer is different from subsequent pages
     * 
     * @public
     * @function setDifferentFirstPage
     * @param {boolean} value - true if first page has different header and footer from subsequent pages, otherwise false
     * @return {} - No return types.
     */
    public setDifferentFirstPage(value: boolean) {
        this.differentFirstPage = value;
    }

    //json block representing the style for the first page header
    private firstPageHeaderStyle: any = {
        fillColor: '#464646',
        alignment: 'center',
        margin: [ 8, 7, 8, 0 ]
    };

    //json block representing the first page header
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

    /**
     * get the first page header json block
     * 
     * @public
     * @function getFirstPageHeader
     * @return {any} - json block representing the first page header
     */
    public getFirstPageHeader(): any {
        return this.firstPageHeader;
    }

    /**
     * set the first page header json block
     * 
     * @public
     * @function setFirstPageHeader
     * @param {any} header - json block representing the first page header
     * @return {} - No return types.
     */
    public setFirstPageHeader(header: any) {
        this.firstPageHeader = header;
    }

    //json block representing the style for the first page footer
    private firstPageFooterStyle: any = {
        fillColor: '#464646',
        alignment: 'center',
        margin: [ 8, -12, 8, 0 ]
    };

    //json block representing the first page footer
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

    /**
     * get the first page footer json block
     * 
     * @public
     * @function getFirstPageFooter
     * @return {any} - json block representing the first page footer
     */
    public getFirstPageFooter(): any {
        return this.firstPageFooter;
    }

    /**
     * set the first page footer json block
     * 
     * @public
     * @function setFirstPageFooter
     * @param {any} footer - json block representing the default page footer
     * @return {} - No return types.
     */
    public setFirstPageFooter(footer: any) {
        this.firstPageFooter = footer;
    }

    //json block representing the default page header
    private defaultHeader: any = {
        text: 'Cyber OverVue Report',
        alignment: 'right',
        fontSize: 11,
        color: '#7f7f7f',
        margin: [70, 25, 70, 0]
    };

    /**
     * get the default page header json block
     * 
     * @public
     * @function getDefaultPageHeader
     * @return {any} - json block representing the default page header
     */
    public getDefaultPageHeader(): any {
        return this.defaultHeader;
    }

    /**
     * set the default page header json block
     * 
     * @public
     * @function setDefaultPageHeader
     * @param {any} header - json block representing the default page header
     * @return {} - No return types.
     */
    public setDefaultPageHeader(header: any) {
        this.defaultHeader = header;
    }

    //json block representing the style for the default page footer
    private defaultFooterStyle: any = {
        fontSize: 8,
        color: '#7f7f7f',
        margin: [ 64, 0, 60, 0 ]
    };

    //json block representing the default page footer
    private defaultFooter: any = {
        style: 'defaultFooterStyle',
        table: {
            widths: ['*', '10'],
            body: [
                [
                    {
                        text: `For a detailed explanation of terms and analytics, please see the Appendix at the end of this report 
                               Analytics in Cyber OverVue powered by Advisen’s proprietary cyber loss data and transaction data`,
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

    /**
     * get the default page footer json block
     * 
     * @public
     * @function getDefaultPageFooter
     * @return {any} - json block representing the default page footer
     */
    public getDefaultPageFooter(): any {
        return this.defaultFooter;
    }

    /**
     * set the default page footer json block
     * 
     * @public
     * @function setDefaultPageFooter
     * @param {any} footer - json block representing the default page footer
     * @return {} - No return types.
     */
    public setDefaultPageFooter(footer: any) {
        this.defaultFooter = footer;
    }

    /**
     * set the header for a specific page
     * 
     * @private
     * @function headerCallback
     * @param {number} currentPage - the current page the pdf generation process is working on to add a header
     * @param {number} pageCount - the total number of pages in the final pdf
     * @return {any} - return json block representing header
     */
    private headerCallback(currentPage: number, pageCount: number): any {
        if(this.differentFirstPage && (currentPage == 1)) {
            return this.firstPageHeader;
        } else {
            return this.defaultHeader;
        }
    }

    /**
     * set the footer for a specific page
     * 
     * @private
     * @function footerCallback
     * @param {number} currentPage - the current page the pdf generation process is working on to add a footer
     * @param {number} pageCount - the total number of pages in the final pdf
     * @return {any} - return json block representing footer
     */
    private footerCallback(currentPage: number, pageCount: number): any {
        this.pageCount = pageCount;
        if(this.differentFirstPage && (currentPage == 1)) {
            return this.firstPageFooter;
        } else {
            this.defaultFooter.table.body[0][1].text = currentPage;
            return this.defaultFooter;
        }
    }

    /**
     * get the page orientation
     * 
     * @public
     * @function setPageOrientation
     * @return {string} - page orientation can be either portrait or landscape
     */
    public getPageOrientation(): string {
        return this.pdfContent.pageOrientation;
    }

    /**
     * set the page orientation
     * 
     * @public
     * @function setPageOrientation
     * @param {string} value - page orientation can be either portrait or landscape
     * @return {} - No return types.
     */
    public setPageOrientation(value: string) {
        this.pdfContent.pageOrientation = value;
    }

    /**
     * get the page margin array [left, top, right, bottom]
     * 
     * @public
     * @function getContent
     * @return {number[]} - array representing margin spacing around the page
     */
    public getPageMargins(): number[] {
        return this.pdfContent.pageMargins;
    }

    /**
     * set the page margin spacing
     * 
     * @public
     * @function getContent
     * @param {number} left - left margin
     * @param {number} top - top margin
     * @param {number} right - right margin
     * @param {number} bottom - bottom margin
     * @return {} - No return types.
     */
    public setPageMargins(left: number, top: number, right: number, bottom: number) {
        this.pdfContent.pageMargins = [left, top, right, bottom];
    }

    private pageCount: number = 0;

    /**
     * get the number pages that the final pdf will have
     * the underlying value is set when you use pdfMake library 
     * to print.  During the pagination of the footer, the 
     * footer function callback will set the page count value.
     * 
     * @public
     * @function getContent
     * @return {number} - the number of pages that the current content will be rendered to
     */
    public getPageCount(): number {
        return this.pageCount;
    }

    constructor() {
        this.addHeaderFooterStyles();
    }

    /**
     * add in the style required for the header and footer 
     * for all pages to the current instance of pdfBuilder
     * 
     * @private
     * @function addHeaderFooterStyles
     * @return {} - No return types.
     */
    private addHeaderFooterStyles() {
        this.pdfContent.styles['firstPageHeaderStyle'] = this.firstPageHeaderStyle;
        this.pdfContent.styles['firstPageFooterStyle'] = this.firstPageFooterStyle;
        this.pdfContent.styles['defaultFooterStyle'] = this.defaultFooterStyle;
    }

    /**
     * Add an style json block to the current pdf builder's 
     * associative array of styles 
     * 
     * @public
     * @function addStyle
     * @param {string} styleName - style name
     * @param {any} style - style json object
     * @return {} - No return types.
     */
    public addStyle(styleName: string, style: any) {
        this.pdfContent.styles[styleName] = style;
    }

    /**
     * Add an associative array of styles to the current 
     * pdf builder's associative array of styles 
     * 
     * @private
     * @function addStyles
     * @param {Array<any>} styles - associative array of styles
     * @return {} - No return types.
     */
    private addStyles(styles: Array<any>) {
        for(let styleName in styles) {
            this.pdfContent.styles[styleName] = styles[styleName];
        }
    }

    /**
     * remove all the styles contained in the current 
     * instance of pdfBuilder
     * 
     * @public
     * @function clearStyles
     * @return {} - No return types.
     */
    public clearStyles() {
        for(let styleName in this.pdfContent.styles) {
            delete this.pdfContent.styles[styleName];
        }
        this.addHeaderFooterStyles();
    }

    /**
     * Add an image to the current pdf builder's 
     * associative array of images 
     * 
     * @public
     * @function addImage
     * @param {string} imageLabel - image name
     * @param {string} dataUrl - base64 encoding of image's data
     * @return {} - No return types.
     */
    public addImage(imageLabel: string, dataUrl: string) {
        this.pdfContent.images[imageLabel] = dataUrl;
    }

    /**
     * Add an associative array of images to the current 
     * pdf builder's associative array of images 
     * 
     * @private
     * @function addImages
     * @param {Array<any>} images - associative array of images
     * @return {} - No return types.
     */
    private addImages(images: Array<string>) {
        for(let imageLabel in images) {
            //console.log('"' + imageLabel + '":"' + images[imageLabel] + '"');
            this.pdfContent.images[imageLabel] = images[imageLabel];
        }
    }

    /**
     * remove all the images contained in the current 
     * instance of pdfBuilder
     * 
     * @public
     * @function clearImages
     * @return {} - No return types.
     */
    public clearImages() {
        for(let imageLabel in this.pdfContent.images) {
            delete this.pdfContent.images[imageLabel];
        }
        //this.pdfContent.images = {};
    }
    
    /**
     * remove the last page break in the last text block on the 
     * last page of the pdf to avoid a blank last page
     * 
     * @public
     * @function trimLastPageBreak
     * @return {} - No return types.
     */
    public trimLastPageBreak() {
        let n: number = this.pdfContent.content.length;
        let lastContentBlock: any = this.pdfContent.content[n - 1];
        if(lastContentBlock && lastContentBlock.pageBreak) {
            delete lastContentBlock.pageBreak;
        }
    }

    /**
     * get the pdf json structure for use with the pdfmake 
     * library to generate the final pdf
     * 
     * @public
     * @function getContent
     * @return {any} - json object representing the the final pdf
     */
    public getContent(): any {
        //console.log('Begin Styles');
        //console.log(JSON.stringify(this.pdfContent.styles));
        //console.log('End Styles');
        return this.pdfContent;
    }

    /**
     * Add an array pdf text json blocks to the current 
     * pdf builder's array of json blocks 
     * 
     * @private
     * @function addPdfContent
     * @param {Array<any>} pdfTextBlocks - array of json pdf text blocks
     * @return {} - No return types.
     */
    private addPdfContent(pdfTextBlocks: Array<any>) {
        pdfTextBlocks.forEach(pdfTextBlock => {
            //console.log('Begin Block');
            //console.log(JSON.stringify(pdfTextBlock));
            //console.log('End Block');
            this.pdfContent.content.push(pdfTextBlock);
        });
    }

    /**
     * clear pdf text content
     * 
     * @public
     * @function clearPdfContent
     * @return {} - No return types.
     */
    public clearPdfContent() {
        this.pdfContent.content.length = 0;
    }

    /**
     * Adds a page object to pdfBuilder by getting the page's content, images and styles
     * All page object have a common base class BasePage
     * 
     * @public
     * @function addPage
     * @param {BasePage} page - page object
     * @return {} - No return types.
     */
    public addPage(page: BasePage) {
        this.addImages(page.getImages());
        this.addStyles(page.getStyles());
        this.addPdfContent(page.getPdfContent());
    }
    
}