import { BasePage } from './base.page';
import { ComponentPrintSettings } from 'app/model/model';

export class DashboardPage extends BasePage  {

    //page type name for this page
    public static pageType:string = 'DashboardPage';

    //default page prefix of this page to prevent json object names from one page don't clash with other pages
    private prefix: string = DashboardPage.pageType + '_';

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
        return DashboardPage.pageType;
    }

    //flag if the page has no content to include/exclude on pdf
    private hasNoContent:boolean = false;

    /**
     * get the page if has n content
     * 
     * @public
     * @function getHasNoContent
     * @return {boolean} - if page has no content
     */
    public getHasNoContent() {
        return this.hasNoContent;
    }

    /**
     * Setter function to set if the page has no content
     * 
     * @public
     * @function setHasNoContent
     * @param {boolean} hasNoContent - if has no content for this page
     * @return {} - No return types.
     */
    public setHasNoContent(hasNoContent: boolean) {
        this.hasNoContent = hasNoContent;
    }

    //json block representing the style for header within this page
    private headerStyle: any = {
        color: '#27a9bc',
        fontSize: 16,
        bold: true,
        margin: [60,0,40,0]
    };

    //json block representing the header within this page
    private header: any = {
        text: 'Dashboard',
        style: this.prefix + 'headerStyle'
    };

    //json block for the table header style for use as sub header within this page
    private tableHeaderStyle: any = {
        color: '#b1d23b',
        fontSize: 14,
        bold: true
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

    //left image caption
    private imageLeftCaption:string = '';

    //middle image name
    private imageMiddle:string = '';

    //middle image data url
    private imageMiddleUrl:string = '';

    //middle image caption
    private imageMiddleCaption:string = '';

    //right image name
    private imageRight:string = '';

    //right image data url
    private imageRightUrl:string = '';

    //middle image caption
    private imageRightCaption:string = '';

    //json block for the table structure to hold first row of images and page sub headers
    private table: any = {
        margin: [ 35, 20, 70, 0 ],
        table: {
            heights: [ 15, 200, 150 ],
            body: [
                [
                    { text: '', alignment: 'center', style: this.prefix + 'tableHeaderStyle' }, 
                    { text: '', alignment: 'center', style: this.prefix + 'tableHeaderStyle' }, 
                    { text: '', alignment: 'center', style: this.prefix + 'tableHeaderStyle' }
                ],                
                [
                    {
                        // image: this.imageLeft,
                        // width: 240
                    },
                    {
                        // image: this.imageMiddle,
                        // width: 240
                    },
                    {
                        // image: this.imageRight,
                        // width: 240
                    }
                ],
                [
                    {
                        margin: [ 15, -60, 0, 0 ],
                        columns: [
                            { text: '', width: 220, style: this.prefix + 'captionStyle' },
                        ]
                    },
                    {
                        margin: [ 15, -60, 0, 0 ],
                        columns: [
                            { text: '', width: 220, style: this.prefix + 'captionStyle' },
                        ]
                    },
                    {
                        margin: [ 15, -60, 0, 0 ],
                        columns: [
                            { text: '', width: 220, style: this.prefix + 'captionStyle' },
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

        let dashboardSectionList: Array<any> = [];
        let i: number;

        //User might not select all the charts and leave gaps within the page with no charts
        //Coalesce the array of images and corresponding headers to avoid gaps
        if(this.imageLeft && this.imageLeftUrl) {
            dashboardSectionList.push(
                {
                    header: "Frequency",
                    imageLink: this.prefix + this.imageLeft,
                    caption: this.imageLeftCaption
                }
            );
        }
        if(this.imageMiddle && this.imageMiddleUrl) {
            dashboardSectionList.push(
                {
                    header: "Severity",
                    imageLink: this.prefix + this.imageMiddle,
                    caption: this.imageMiddleCaption
                }
            );
        }
        if(this.imageRight && this.imageRightUrl) {
            dashboardSectionList.push(
                {
                    header: "Benchmark",
                    imageLink: this.prefix + this.imageRight,
                    caption: this.imageRightCaption
                }
            );
        }
        for(i = 0; i < dashboardSectionList.length; i++) {
            this.table.table.body[0][i].text = dashboardSectionList[i].header;
            this.table.table.body[1][i] = {
                image: dashboardSectionList[i].imageLink,
                width: 240
            }
            this.table.table.body[2][i].columns[0].text = dashboardSectionList[i].caption;
        }
        for(; i < 3; i++) {
            this.table.table.body[0][i].text = '';
            this.table.table.body[1][i] = {
                text: '',
                margin: [ 240, 0, 0, 0 ]
            };
            this.table.table.body[2][i].columns[0].text = '';
        }

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
            width: 400,
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
        if((index >= 0) && (index <= 2) && chartCaptionText) {
            switch(index) {
                case 0:
                    this.imageLeftCaption = chartCaptionText;
                    break;
                case 1:
                    this.imageMiddleCaption = chartCaptionText;
                break;
                case 2:
                    this.imageRightCaption = chartCaptionText;
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
        if(index >= 0 && index <= 2) {
            chartName = chartName.replace(/\-/g,'_');
            let imageName = this.prefix + chartName;
            switch(index) {
                case 0:
                    this.imageLeft = chartName;
                    this.imageLeftUrl = chartDataUrl;
                    break;
                case 1:
                    this.imageMiddle = chartName;
                    this.imageMiddleUrl = chartDataUrl;
                break;
                case 2:
                    this.imageRight = chartName;
                    this.imageRightUrl = chartDataUrl;
                break;
                default:
                    break;
            }
            this.images[imageName] = chartDataUrl;
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
        this.table.table.body[0][0].style = this.prefix + 'tableHeaderStyle';
        this.table.table.body[0][1].style = this.prefix + 'tableHeaderStyle';
        this.table.table.body[0][2].style = this.prefix + 'tableHeaderStyle';
        
        this.table.table.body[2][0].columns[0].style = this.prefix + 'captionStyle';
        this.table.table.body[2][1].columns[0].style = this.prefix + 'captionStyle';
        this.table.table.body[2][2].columns[0].style = this.prefix + 'captionStyle';

        this.clearArray(this.styles);
        this.styles[this.prefix + 'headerStyle'] = this.headerStyle;
        this.styles[this.prefix + 'tableHeaderStyle'] = this.tableHeaderStyle;
        this.styles[this.prefix + 'captionStyle'] = this.captionStyle;

        this.clearArray(this.images);
        if(this.imageLeftUrl) {
            this.images[this.prefix + this.imageLeft] = this.imageLeftUrl;
        }
        if(this.imageMiddleUrl) {
            this.images[this.prefix + this.imageMiddle] = this.imageMiddleUrl;    
        }
        if(this.imageRightUrl) {
            this.images[this.prefix + this.imageRight] = this.imageRightUrl;    
        }

        this.clearArray(this.pdfContent);
        this.pdfContent.push(this.header);
        this.pdfContent.push(this.table);
    }
};