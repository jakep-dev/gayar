import { BasePage } from './base.page';
import { ComponentPrintSettings } from 'app/model/model';

export class SeverityNetworkSecurityPage extends BasePage  {

    //page type name for this page
    public static pageType:string = 'SeverityNetworkSecurityPage';

    //default page prefix of this page to prevent json object names from one page don't clash with other pages
    private prefix: string = SeverityNetworkSecurityPage.pageType + '_';

    /**
     * get the page prefix for the current page of the assessment report
     * 
     * @public
     * @function getPrefix
     * @return {string} - page prefix for the current page of the assessment report.
     */
    public getPrefix() {
        return this.prefix;
    }

    /**
     * Setter function to set the prefix for this page
     * 
     * @public
     * @function setPrefix
     * @param {string} prefix - prefix use for this page
     * @return {} - No return types.
     */
    public setPrefix(prefix: string) {
        this.prefix = prefix;
        this.updatePdfContent();
    }

    /**
     * get the page type for the current page of the assessment report
     * 
     * @public
     * @function getPageType
     * @return {string} - page type for the current page of the assessment report.
     */
    public getPageType(): string {
        return SeverityNetworkSecurityPage.pageType;
    }

    //Indicate if we are showing the section header
    //This happens when this is the first page selected in the section by the user
    private showTopHeader: boolean = false;

    //json block representing the style for section header within this page
    private topHeaderStyle: any = {
        color: '#27a9bc',
        fontSize: 16,
        bold: true,
        margin: [60,0,40,0]
    };

    //json block representing the section header within this page
    private topHeader: any = {
        text: 'Severity\n\n',
        style: this.prefix + 'topHeaderStyle'
    };

    //json block representing the style for header within this page
    private headerStyle: any = {
        color: '#464646',
        fontSize: 12,
        bold: true,
        margin: [ 60, 0, 40, 0]
    };

    //json block representing the header within this page
    private header: any = {
        text: 'Network Security',
        style: this.prefix + 'headerStyle'
    };

    //json block for the chart caption text style
    private captionStyle: any = {
        color: '#464646',
        fontSize: 12,
        bold: false,
        alignment: 'justify'
    };

    //left image name
    private imageLeft:string = '';
    //left image data url
    private imageLeftUrl:string = '';
    //right image name
    private imageRight:string = '';
    //right image data url
    private imageRightUrl:string = '';

    //json block for the table structure to hold first row of images and page sub headers
    private table: any = {
        margin: [ 30, 23, 70, 0 ],
        table: {
            heights: [ 15, 270, 100 ],
            body: [
                [
                    { text: '' },
                    { text: '' }
                ],
                [
                    {
                        text: ''
                        //image: this.imageLeft,
                        //width: 375
                    },
                    {
                        text: ''
                        //image: this.imageRight,
                        //width: 375
                    }
                ],
                [
                    {
                        margin: [ 30, -10, 0, 0 ],
                        columns: [
                            { text: '', width: 340, style: this.prefix + 'captionStyle' },
                        ]
                    },
                    {
                        margin: [ 30, -10, 0, 0 ],
                        columns: [
                            { text: '', width: 340, style: this.prefix + 'captionStyle' },
                        ]
                    }
                ]
            ]
        },
        layout: 'noBorders',
        pageBreak: 'after'
    };

    //Array of json blocks for this page
    private pdfContent: Array<any> = [];

    /**
     * get the pdf content array for the assessment report
     * 
     * @public
     * @function getPdfContent
     * @return {Array<any>} - array of json objects for the assessment report.
     */
    public getPdfContent(): Array<any> {
        return this.pdfContent;
    }

    //Associative array of styles for this page
    //Maps style name to style json object
    private styles: Array<any> = [];

    /**
     * get the style array for the assessment report
     * 
     * @public
     * @function getStyles
     * @return {Array<any>} - Associative array of styles for the assessment report.
     */
    public getStyles(): Array<any> {
        return this.styles;
    }

    //Associative array of images for this page
    //Maps image name to dataUrl
    private images: Array<string> = [];

    /**
     * get the images array for the assessment report
     * 
     * @public
     * @function getImages
     * @return {Array<string>} - Associative array of images for the assessment report.
     */
    public getImages(): Array<string> {
        return this.images;
    }

    constructor() {
        super();
        this.updatePdfContent();
    }

    /**
     * get the chart component size within the page object
     * This allows the page object to tell the report component 
     * that a chart in a given position needs to have a specific
     * width and height in order to be display properly within 
     * the pdf page
     * 
     * @public
     * @function getPrintSettings
     * @param {number} componentOrder - the position within the page object
     * @return {ComponentPrintSettings} - ComponentPrintSettings object that contains information on the width and height allocated to show the image
     */
    public getPrintSettings(componentOrder: number) : ComponentPrintSettings {
        //all charts in this page type are the same size
        return {
            width: 550,
            height: 400,
            drillDown: ''
        };
    }

    /**
     * set the caption text for this chart object will be render out to the final pdf
     * 
     * @public
     * @function setChartCaption
     * @param {number} chartPosition - the position within the page object
     * @param {string} captionText - caption text for the chart image
     * @return {} - No return types.
     */
    public setChartCaption(index: number, chartCaptionText: string) {
        if((index >= 0) && (index <= 1) && chartCaptionText) {
            switch(index) {
                case 0:
                    this.table.table.body[2][index].columns[0].text = chartCaptionText;
                    break;
                case 1:
                    this.table.table.body[2][index].columns[0].text = chartCaptionText;
                    break;

                default:
                    break;
            }
        }
    }

    /**
     * Adds the given chart to a specific position within the underlying page object
     * returns the page number the chart is added to
     * For most pages, it shoult all be on the first page
     * 
     * @public
     * @function addChartLabel
     * @param {number} index - page position within the page object
     * @param {string} chartName - chart name
     * @param {string} chartDataUrl - png image data in string format
     * @return {number} - the page number the chart is added to
     */
    public addChartLabel(index: number, chartName: string, chartDataUrl: string): number {
        if(index >= 0 && index <= 1) {
            if(chartName && chartDataUrl) {
                chartName = chartName.replace(/\-/g,'_');
                let imageName = this.prefix + chartName;
                //replace text attribute with image and width attributes
                if(typeof this.table.table.body[1][index].text !== 'undefined') {
                    delete this.table.table.body[1][index].text;
                }
                this.table.table.body[1][index].image = imageName;
                this.table.table.body[1][index].width = 375;
                switch(index) {
                    case 0:
                        this.imageLeft = chartName;
                        this.imageLeftUrl = chartDataUrl;
                        break;
                    case 1:
                        this.imageRight = chartName;
                        this.imageRightUrl = chartDataUrl;
                        break;

                    default:
                        break;
                }
                this.images[imageName] = chartDataUrl;
            } else {
                //replace image and width attributes with text attribute
                if(typeof this.table.table.body[1][index].image !== 'undefined') {
                    delete this.table.table.body[1][index].image;
                }
                if(typeof this.table.table.body[1][index].width !== 'undefined') {
                    delete this.table.table.body[1][index].width;
                }
                this.table.table.body[1][index].text = '';
            }
        }
        //all content added are on first page
        return 1;
    }

    /**
     * Update style names, image names when the page prefix changes
     * 
     * @private
     * @function updatePdfContent
     * @return {} - No return types.
     */
    private updatePdfContent() {

        this.header.style = this.prefix + 'headerStyle';
        this.topHeader.style = this.prefix + 'topHeaderStyle';
        this.table.table.body[2][0].columns[0].style = this.prefix + 'captionStyle';
        this.table.table.body[2][1].columns[0].style = this.prefix + 'captionStyle';

        this.clearArray(this.styles);
        this.styles[this.prefix + 'headerStyle'] = this.headerStyle;
        this.styles[this.prefix + 'topHeaderStyle'] = this.topHeaderStyle;
        this.styles[this.prefix + 'captionStyle'] = this.captionStyle;

        this.clearArray(this.images);
        if(this.imageLeftUrl) {
            this.images[this.prefix + this.imageLeft] = this.imageLeftUrl;
            this.table.table.body[1][0].image = this.prefix + this.imageLeft;
        }
        if(this.imageRightUrl) {
            this.images[this.prefix + this.imageRight] = this.imageRightUrl;
            this.table.table.body[1][1].image = this.prefix + this.imageRight;
        }

        this.clearArray(this.pdfContent);
        if(this.showTopHeader) {
            this.pdfContent.push(this.topHeader);
        }
        this.pdfContent.push(this.header);
        this.pdfContent.push(this.table);
    }

    /**
     * Tell the page to shoe or hide the header
     * 
     * @public
     * @function showHeader
     * @param {boolean} isShowHeader - true to show header, false to hide header
     * @return {} - No return types.
     */
    public showHeader(showHeader: boolean) {
        this.showTopHeader = showHeader;
        this.clearArray(this.pdfContent);
        if(this.showTopHeader) {
            this.pdfContent.push(this.topHeader);
        }
        this.pdfContent.push(this.header);
        this.pdfContent.push(this.table);
    }
};
