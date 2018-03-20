import { BasePage } from './base.page';
import { ComponentPrintSettings } from 'app/model/model';

export class BenchmarkPage extends BasePage  {

    //page type name for this page
    public static pageType:string = 'BenchmarkPage';

    //default page prefix of this page to prevent json object names from one page don't clash with other pages
    private prefix: string = BenchmarkPage.pageType + '_';

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
        return BenchmarkPage.pageType;
    }

    //flag if the page has no content to include/exclude on pdf
    //initially set hasNoContent to true for pages that contains chart(s)
    private hasNoContent:boolean = true;

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
        text: 'Benchmark',
        style: this.prefix + 'headerStyle'
    };

    //json block representing the header place holder within this page
    private blankHeader1: any = {
        text: ' ',
        style: this.prefix + 'headerStyle'
    };

    //json block representing the header place holder within this page
    private blankHeader2: any = {
        text: ' ',
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

    //json block for the table structure to hold first row of images and page sub headers
    private tableRow1: any = {
        margin: [ 60, 20, 70, 0 ],
        table: {
            heights: [ 15, 250, 100 ],
            body: [
                [
                    { text: '', alignment: 'left', style: this.prefix + 'tableHeaderStyle' },
                    { text: '', alignment: 'left', style: this.prefix + 'tableHeaderStyle' }
                ],
                [
                    {
                        margin: [ -15, 0, 0, 0 ]
                    },
                    {
                        margin: [ -15, 0, 0, 0 ]
                    }
                ],
                [
                    {
                        margin: [ -10, 0, 0, 0 ],
                        columns: [
                            { text: '', width: 340, style: this.prefix + 'captionStyle' },
                        ]
                    },
                    {
                        margin: [ -10, 0, 0, 0 ],
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

    //json block for the table structure to hold second row of images and page sub headers
    private tableRow2: any = {
        margin: [ 60, 20, 70, 0 ],
        table: {
            heights: [ 15, 250, 100 ],
            body: [
                [
                    { text: '', alignment: 'left', style: this.prefix + 'tableHeaderStyle' },
                    { text: '', alignment: 'left', style: this.prefix + 'tableHeaderStyle' }
                ],
                [
                    {
                        margin: [ -15, 0, 0, 0 ]
                    },
                    {
                        margin: [ -10, 0, 0, 0 ]
                    }
                ],
                [
                    {
                        margin: [ -10, 0, 0, 0 ],
                        columns: [
                            { text: '', width: 340, style: this.prefix + 'captionStyle' },
                        ]
                    },
                    {
                        margin: [ -10, 0, 0, 0 ],
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

    //json block for the table structure to hold third row of image and page sub header
    private tableRow3: any = {
        margin: [ 60, 20, 70, 0 ],
        table: {
            heights: [ 15, 250, 100 ],
            body: [
                [
                    { text: '', alignment: 'left', style: this.prefix + 'tableHeaderStyle' },
                    { text: '', alignment: 'left', style: this.prefix + 'tableHeaderStyle' }
                ],
                [
                    {
                        margin: [ -5, 0, 0, 0 ]
                    },
                    {
                        text: ''
                    }
                ],
                [
                    {
                        margin: [ -10, 0, 0, 0 ],
                        columns: [
                            { text: '', width: 340, style: this.prefix + 'captionStyle' },
                        ]
                    },
                    { text: '' }
                ]
            ]
        },
        layout: 'noBorders',
        pageBreak: 'after'
    };

    //build array of header object locations to facilitate array based manipulation of sub headers
    private headerTargetObjects: Array<any> = [
        this.tableRow1.table.body[0][0],
        this.tableRow1.table.body[0][1],
        this.tableRow2.table.body[0][0],
        this.tableRow2.table.body[0][1],
        this.tableRow3.table.body[0][0]
    ];

    //build array of image object locations to facilitate array based manipulation of images
    private imageTargetObjects: Array<any> = [
        this.tableRow1.table.body[1][0],
        this.tableRow1.table.body[1][1],
        this.tableRow2.table.body[1][0],
        this.tableRow2.table.body[1][1],
        this.tableRow3.table.body[1][0]
    ];

    //build array of caption object locations to facilitate array based manipulation of caption text
    private captionTargetObjects: Array<any> = [
        this.tableRow1.table.body[2][0],
        this.tableRow1.table.body[2][1],
        this.tableRow2.table.body[2][0],
        this.tableRow2.table.body[2][1],
        this.tableRow3.table.body[2][0]
    ];

    //build array of chart image objects with corresponding titles
    //index position of this array is the page position of the image used in function addChartLabel
    //each image position has a specific left margin requirement
    private chartList: Array<any> = [
        {
            chartTitle: 'Limit Adequacy',
            imageName: '',
            imageData: '',
            leftMargin: -5,
            displayText: '',
            displayLeftMargin: 10,
            displayTopMargin: -30
        },
        {
            chartTitle: 'Premium Distribution',
            imageName: '',
            imageData: '',
            leftMargin: -15,
            displayText: '',
            displayLeftMargin: 10,
            displayTopMargin: -10
        },
        {
            chartTitle: 'Limit Distribution',
            imageName: '',
            imageData: '',
            leftMargin: -15,
            displayText: '',
            displayLeftMargin: 10,
            displayTopMargin: -10
        },
        {
            chartTitle: 'Retention Distribution',
            imageName: '',
            imageData: '',
            leftMargin: -15,
            displayText: '',
            displayLeftMargin: 10,
            displayTopMargin: -10
        },
        {
            chartTitle: 'Rate Per Million Distribution',
            imageName: '',
            imageData: '',
            leftMargin: -10,
            displayText: '',
            displayLeftMargin: 10,
            displayTopMargin: -10
        }
    ];

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

        let i: number;
        let j: number;
        let imageCount: number = 0;

        //User might not select all the charts and leave gaps within the page with no charts
        //Coalesce the array of images and corresponding headers to avoid gaps
        for(i = 0; i < this.chartList.length; i++) {
            if(this.chartList[i].imageName && this.chartList[i].imageData) {
                this.headerTargetObjects[imageCount].text = this.chartList[i].chartTitle;
                this.imageTargetObjects[imageCount].image = this.prefix + this.chartList[i].imageName;
                this.imageTargetObjects[imageCount].width = 375;
                this.imageTargetObjects[imageCount].margin[0] = this.chartList[i].leftMargin;
                this.captionTargetObjects[imageCount].columns[0].text = this.chartList[i].displayText;
                this.captionTargetObjects[imageCount].margin[0] = this.chartList[i].displayLeftMargin;
                this.captionTargetObjects[imageCount].margin[1] = this.chartList[i].displayTopMargin;
                imageCount++;
            }
        }
        for(j = imageCount; j < this.headerTargetObjects.length; j++) {
            this.headerTargetObjects[j].text = '';
            this.imageTargetObjects[j].text = '';
            this.captionTargetObjects[j].columns[0].text = '';
        }

        //clear pdd contents
        this.clearArray(this.pdfContent);

        //add header json block
        this.pdfContent.push(this.header);

        //add first row, if there is either 1 or 2 images
        if(imageCount > 0) {
            this.pdfContent.push(this.tableRow1);
        }
        //add second row, if there is either 3 or 4 images
        if(imageCount > 2) {
            this.pdfContent.push(this.blankHeader1);
            this.pdfContent.push(this.tableRow2);
        }
        //add third row, if there are 5 images
        if(imageCount > 4) {
            this.pdfContent.push(this.blankHeader2);
            this.pdfContent.push(this.tableRow3);
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
            width: 585,
            height: 400,
            drillDown: ''
        };
    }

    /**
     * get the number of images added to page
     * 
     * @private
     * @function getImageCount
     * @return {number} - the number images added to page
     */

    private getImageCount(): number {
        let i: number;
        let imageCount: number = 0;
        for(i = 0; i < this.chartList.length; i++) {
            if(this.chartList[i].imageName && this.chartList[i].imageData) {
                imageCount++;
            }
        }
        return imageCount;        
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
        if((index >= 0) && (index <= 4) && chartCaptionText) {
            this.chartList[index].displayText = chartCaptionText;
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
        if(index >= 0 && index <= 4) {
            chartName = chartName.replace(/\-/g,'_');
            let imageName = this.prefix + chartName;
            this.chartList[index].imageName = chartName;
            this.chartList[index].imageData = chartDataUrl;
            this.images[imageName] = chartDataUrl;
        }
        return this.getPageCount();
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
        this.blankHeader1.style = this.prefix + 'headerStyle';
        this.blankHeader2.style = this.prefix + 'headerStyle';
        this.tableRow1.table.body[0][0].style = this.prefix + 'tableHeaderStyle';
        this.tableRow1.table.body[0][1].style = this.prefix + 'tableHeaderStyle';
        this.tableRow2.table.body[0][0].style = this.prefix + 'tableHeaderStyle';
        this.tableRow2.table.body[0][1].style = this.prefix + 'tableHeaderStyle';
        this.tableRow3.table.body[0][0].style = this.prefix + 'tableHeaderStyle';

        this.tableRow1.table.body[2][0].columns[0].style = this.prefix + 'captionStyle';
        this.tableRow1.table.body[2][1].columns[0].style = this.prefix + 'captionStyle';
        this.tableRow2.table.body[2][0].columns[0].style = this.prefix + 'captionStyle';
        this.tableRow2.table.body[2][1].columns[0].style = this.prefix + 'captionStyle';
        this.tableRow3.table.body[2][0].columns[0].style = this.prefix + 'captionStyle';
        
        this.clearArray(this.styles);
        this.styles[this.prefix + 'headerStyle'] = this.headerStyle;
        this.styles[this.prefix + 'tableHeaderStyle'] = this.tableHeaderStyle;
        this.styles[this.prefix + 'captionStyle'] = this.captionStyle;

        this.clearArray(this.images);

        let i: number;
        let imageCount: number = 0;
        for(i = 0; i < this.chartList.length; i++) {
            if(this.chartList[i].imageName && this.chartList[i].imageData) {
                this.images[this.prefix + this.chartList[i].imageName] = this.chartList[i].imageData;
                imageCount++;
            }
        }
    }

    /**
     * get the number of pages that this page object will be render out to the final pdf
     * 
     * @public
     * @function getPageCount
     * @return {number} - the number of pages that this page object will be render out to the final pdf
     */
    public getPageCount() {
        let imageCount: number = this.getImageCount();

        if(imageCount > 4) {
            return 3;
        } else if(imageCount > 2) {
            return 2;
        } else {
            return 1;
        }
    }
};