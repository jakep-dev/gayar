import { DatePipe } from '@angular/common';

import { BasePage } from './base.page';
import { GetFileService } from 'app/services/services';

export class CoverPage extends BasePage  {

    //page type name for this page
    public static pageType:string = 'CoverPage';

    //service used to download advisen logo
    private fileService: GetFileService;

    //data url for the advisen logo
    private logoDataUrl: string;

    //default page prefix of this page to prevent json object names from one page don't clash with other pages
    private prefix: string = CoverPage.pageType + '_';

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
     * get the page type for the current page of the assessment report
     * 
     * @public
     * @function getPageType
     * @return {string} - page type for the current page of the assessment report.
     */
    public getPageType(): string {
        return CoverPage.pageType;
    }
    
    /**
     * check if the underlying logo image is downloaded already used in the assessment report
     * 
     * @public
     * @function isCoverPageLoaded
     * @return {boolean} - true if the logo image is loaded, otherwise false
     */
    public isCoverPageLoaded(): boolean {
        if((this.logoDataUrl != null)  && (this.logoDataUrl.length > 0))  {
            return true;
        } else {
            return false;
        }
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
     * Update style names, image names when the page prefix changes
     * 
     * @private
     * @function updatePdfContent
     * @return {} - No return types.
     */
    private updatePdfContent() {
        this.companyNameTextObject.style = this.prefix + 'style3';
        this.industryTextObject.style = this.prefix + 'style4';
        this.revenueRangeTextObject.style = this.prefix + 'style4';
        this.dateGeneratedTextObject.style = this.prefix + 'style5';

        //this.images = [];
        this.clearArray(this.images);
        this.images[this.prefix + 'logo'] = this.logoDataUrl;

        //this.styles = [];
        this.clearArray(this.styles);
        this.styles[this.prefix + 'table1'] = this.table1;
        this.styles[this.prefix + 'table2'] = this.table2;
        this.styles[this.prefix + 'style1'] = this.style1;
        this.styles[this.prefix + 'style2'] = this.style2;
        this.styles[this.prefix + 'style3'] = this.style3;
        this.styles[this.prefix + 'style4'] = this.style4;
        this.styles[this.prefix + 'style5'] = this.style5;
        
        this.clearArray(this.pdfContent);
        this.pdfContent.push(
            {
                style: this.prefix + 'table1',
                table: {
                    widths: ['*'],
                    body: [
                        [
                            {
                                text: '\n\n\n',
                                border: [false, false, false, false]
                            }
                        ],
                        [
                            {
                                text: 'Cyber OverVue Report',
                                style: this.prefix + 'style1',
                                border: [false, false, false, false]
                            }
                        ],
                        [
                            {
                                text: '\n',
                                border: [false, false, false, false]
                            }
                        ],
                        [
                            {
                                text: 'for',
                                style: this.prefix + 'style2',
                                border: [false, false, false, false]
                            }
                        ],
                        [
                            {
                                text: '\n',
                                border: [false, false, false, false]
                            }
                        ],
                        [ this. companyNameTextObject ],
                        [
                            {
                                text: '\n',
                                border: [false, false, false, false]
                            }
                        ],
                        [ this.industryTextObject ],
                        [
                            {
                                text: '\n',
                                border: [false, false, false, false]
                            }
                        ],
                        [ this.revenueRangeTextObject ],
                        [
                            {
                                text: '\n\n\n',
                                border: [false, false, false, false]
                            }
                        ],
                        [
                            {
                                text: [
                                    'Created for ',
                                    this.userCompanyTextObject
                                ],
                                style: this.prefix + 'style5',
                                border: [false, false, false, false]
                            }
                        ],
                        [
                            {
                                text: '\n',
                                border: [false, false, false, false]
                            }
                        ],
                        [ this.dateGeneratedTextObject ],
                        [
                            {
                                text: '\n',
                                border: [false, false, false, false]
                            }
                        ]
                    ]
                }
            }
        );
        this.pdfContent.push(
            {
                style: this.prefix + 'table2',
                table: {
                    widths: ['*'],
                    body: [
                        [
                            {
                                image: this.prefix + 'logo',
                                border: [false, false, false, false]
                            }
                        ]
                    ]
                }
            }
        );
        this.pdfContent.push(
            {
                style: this.prefix + 'table1',
                table: {
                    widths: ['*'],
                    body: [
                        [
                            {
                                text: '\n',
                                border: [false, false, false, false]
                            }
                        ]
                    ]
                },
                pageBreak: 'after'
            }
        );
    }

    //Array of json block for cover page
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

    //Associative array of styles for cover page
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

    //Associative array of images for cover page
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

    //style objects used in the cover page
    private table1: any = {
        fillColor: '#464646',
        margin: [0,-3,0,0],
        alignment: 'center'
    };

    private table2: any = {
        fillColor: 'white',
        alignment: 'right'
    };

    private style1: any =  {
        color: 'white',
        fontSize: 28,
        bold: true
    };

    private style2: any = {
        color: '#b1d23b',
        fontSize: 28,
        italics: true
    };

    private style3: any = {
        color: 'white',
        fontSize: 28
    };

    private style4: any = {
        color: 'white',
        fontSize: 20
    };

    private style5: any = {
        color: 'white',
        fontSize: 14
    };

    //Company name text json object for use in cover page
    private companyNameTextObject = {
        text: '<Company Name>',
        style: this.prefix + 'style3',
        border: [false, false, false, false]
    };

    /**
     * Set the company name label for the assessment report
     * 
     * @public
     * @function setCompanyName
     * @param {string} name - company name label
     * @return {} - No return types.
     */
    public setCompanyName(name: string) {
        this.companyNameTextObject.text = name;
    }

    /**
     * get the company name for the assessment report
     * 
     * @public
     * @function getCompanyName
     * @return {string} - Company Name for the assessment report.
     */
    public getCompanyName(): string {
        return this.companyNameTextObject.text;
    }

    //Industry text json object for use in cover page
    private industryTextObject = {
        text: '<Industry>',
        style: this.prefix + 'style4',
        border: [false, false, false, false]
    };

    /**
     * Set the report industry name label for the assessment report
     * 
     * @public
     * @function setIndustryName
     * @param {string} name - Industry name label
     * @return {} - No return types.
     */
    public setIndustryName(name: string) {
        this.industryTextObject.text = name;
    }

    //Revenue range json object for use in cover page
    private revenueRangeTextObject = {
        text: '<Revenue Range>',
        style: this.prefix + 'style4',
        border: [false, false, false, false]
    };

    /**
     * Set the report revenue range label for the assessment report
     * 
     * @public
     * @function setRevenueRangeText
     * @param {string} text - Revenue range label
     * @return {} - No return types.
     */
    public setRevenueRangeText(text: string) {
        this.revenueRangeTextObject.text = text;
    }

    //user's company name json object for use in cover page
    private userCompanyTextObject =  {
        text: '<Company Name of the user>',
    };

    /**
     * Set the report user's company name of the assessment report
     * 
     * @public
     * @function setUserCompanyName
     * @param {string} name - Logged in user's company name
     * @return {} - No return types.
     */
    public setUserCompanyName(name: string) {
        this.userCompanyTextObject.text = name;
    }

    //date json object for use in cover page
    private dateGeneratedTextObject = {
        text: '<Date Generated>',
        style: this.prefix + 'style5',
        border: [false, false, false, false]
    };

    /**
     * Set the report date of the assessment report
     * 
     * @private
     * @function setReportDate
     * @return {} - No return types.
     */
    private setReportDate(){
        let  dp = new DatePipe('en-US');
        this.dateGeneratedTextObject.text = dp.transform(new Date(), 'MMMM d, yyyy');
    }

    constructor() {
        super();
        this.setReportDate();
        this.updatePdfContent();
    }

    /**
     * Setter function to get the reference to GetFileService instance and 
     * start getting the advisen logo image
     * 
     * @public
     * @function setFileService
     * @param {GetFileService} fileService - instance of GetFileService
     * @return {} - No return types.
     */
    public setFileService(fileService: GetFileService) {
        this.fileService = fileService;
        this.fileService.getAsDataUrl('/assets/images/advisen-logo.png');
        this.fileService.fileData$.subscribe(this.updateAdvisenLogo.bind(this));
    }

    /**
     * Callback function to load advisen logo image data into
     * images associative array
     * 
     * @private
     * @function updateAdvisenLogo
     * @param {dataUrl} string - png image data in string format
     * @return {} - No return types.
     */
    private updateAdvisenLogo(dataUrl: string) {
        this.logoDataUrl = dataUrl;
        this.images[this.prefix + 'logo'] = this.logoDataUrl;
    }
}