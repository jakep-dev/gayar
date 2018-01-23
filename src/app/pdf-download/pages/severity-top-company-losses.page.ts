import { BasePage } from './base.page';
import { SeverityDataModel } from 'app/model/model';

export class SeverityTopCompanyLossesPage extends BasePage  {

    //page type name for this page
    public static pageType:string = 'SeverityTopCompanyLossesPage';

    //default page prefix of this page to prevent json object names from one page don't clash with other pages
    private prefix: string = SeverityTopCompanyLossesPage.pageType + '_';

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
        return SeverityTopCompanyLossesPage.pageType;
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

    private headerStyle: any = {
        color: '#464646',
        fontSize: 14,
        bold: true,
        margin: [ 60, 0, 40, 0]
    };

    //json block representing the style for header within this page
    private header: any = {
        text: 'Top Company Losses',
        style: this.prefix + 'headerStyle'
    };
    
    //json block representing the header within this page
    private tableHeaderStyle: any = {
        color: '#464646',
        fontSize: 12,
        bold: true
    };

    //json block for the table header style
    private tableRowContentStyle: any = {
        color: '#464646',
        fontSize: 12
    };

    //json block for the table row content description style
    private tableRowContentDescriptionStyle: any = {
        color: '#464646',
        fontSize: 10
    };

    //json block for the table structure to hold row headers
    //we will dynamically add row at the end of the table at table.table.body array
    private table: any = {
        margin: [ 60, 20, 60, 0 ],
        table: {
            headerRows: 1,
            //widths: ['18%','18%','13%','18%','18%'],
            widths: ['24%', '23%', '13%', '17%', '23%'],
            body: [
                [
                    { text: 'Company Name', alignment: 'left', style: this.prefix + 'tableHeaderStyle', border: [true, true, false, true] },
                    { text: 'Type of Incident', alignment: 'left', style: this.prefix + 'tableHeaderStyle', border: [false, true, false, true] },
                    { text: 'Incident Date', alignment: 'left', style: this.prefix + 'tableHeaderStyle', border: [false, true, false, true] },
                    { text: 'Records Affected', alignment: 'left', style: this.prefix + 'tableHeaderStyle', border: [false, true, false, true] },
                    { text: 'Type of Loss', alignment: 'left', style: this.prefix + 'tableHeaderStyle', border: [false, true, true, true] }
                ]
            ]
        },
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

    //object used to hold the table data
    private peerGroupData: Array<SeverityDataModel>

    private hasDescriptionPermission: boolean;

    /**
     * Function to set the show detail description permission value for this page
     * 
     * @public
     * @function setDesciptionPermission
     * @param {boolean} value - true, the page will render description
     *                          false, the page will not render description
     * @return {} - No return types.
     */
    public setDesciptionPermission(value: boolean) {
        this.hasDescriptionPermission = value;
    }

    /**
     * get the page's show detailed description permission setting
     * 
     * @public
     * @function getDescriptionPermission
     * @return {boolean} - true, the page will render description
     *                     false, the page will not render description
     */
    public getDescriptionPermission(): boolean {
        return this.hasDescriptionPermission;
    }

    constructor() {
        super();
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

        this.header.style = this.prefix + 'headerStyle';
        this.topHeader.style = this.prefix + 'topHeaderStyle';
        this.table.table.body[0][0].style = this.prefix + 'tableHeaderStyle';
        this.table.table.body[0][1].style = this.prefix + 'tableHeaderStyle';
        this.table.table.body[0][2].style = this.prefix + 'tableHeaderStyle';
        this.table.table.body[0][3].style = this.prefix + 'tableHeaderStyle';
        this.table.table.body[0][4].style = this.prefix + 'tableHeaderStyle';

        let i: number;
        let n: number = this.table.table.body.length;
        let tableRow: any;
        for(i = 1; i < n; i++) {
            tableRow = this.table.table.body[i];
            //Only description rows have colSpan attribute
            if(tableRow[0].colSpan) {
                tableRow[0].style = this.prefix + 'tableRowContentDescriptionStyle';
            } else {
                let j: number;
                for(j = 0; j < tableRow.length; j++) {
                    tableRow[j].style = this.prefix + 'tableRowContentStyle';
                }
            }
        }

        this.clearArray(this.styles);
        this.styles[this.prefix + 'headerStyle'] = this.headerStyle;
        this.styles[this.prefix + 'topHeaderStyle'] = this.topHeaderStyle;
        this.styles[this.prefix + 'tableHeaderStyle'] = this.tableHeaderStyle;
        this.styles[this.prefix + 'tableRowContentStyle'] = this.tableRowContentStyle;
        this.styles[this.prefix + 'tableRowContentDescriptionStyle'] = this.tableRowContentDescriptionStyle;

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

    /**
     * set the table data object and load it content 
     * into the current page object
     * 
     * @public
     * @function setPeerGroupData
     * @param {Array<FrequencyDataModel>string} peerGroupData - table data
     * @return {} - No return types.
     */
    public setPeerGroupData(peerGroupData: Array<SeverityDataModel>) {

        if(peerGroupData && peerGroupData.length > 0) {
            this.peerGroupData = peerGroupData;
            this.table.table.body.length = 1;
            let i: number;
            let n: number = this.peerGroupData.length;
            let dataRow: any;
            let dataDescription: any;
            let companyName: string;
            let typeOfIncident: string;
            let incidentDate: string;
            let recordsAffected: string;
            let typeOfLoss: string;
            let caseDescription: string;

            let showBottomBorder: boolean = !this.hasDescriptionPermission;
            for(i = 0; i < n; i++) {
                companyName = (this.peerGroupData[i].company_name != null) ? this.peerGroupData[i].company_name : '';
                typeOfIncident = (this.peerGroupData[i].type_of_incident != null) ? this.peerGroupData[i].type_of_incident : '';
                incidentDate = (this.peerGroupData[i].incident_date != null) ? this.peerGroupData[i].incident_date : '';
                incidentDate = incidentDate.substr(0,10).replace(/\-/g,'/');
                recordsAffected = (this.peerGroupData[i].records_affected != null) ? this.peerGroupData[i].records_affected : '';
                typeOfLoss = (this.peerGroupData[i].type_of_loss != null) ? this.peerGroupData[i].type_of_loss : '';
                caseDescription = (this.peerGroupData[i].case_description != null) ? this.peerGroupData[i].case_description : '';
                dataRow = [
                    { text: companyName, alignment: 'left', style: this.prefix + 'tableRowContentStyle', border: [true, true, false, showBottomBorder] },
                    { text: typeOfIncident, alignment: 'left', style: this.prefix + 'tableRowContentStyle', border: [false, true, false, showBottomBorder] },
                    { text: incidentDate, alignment: 'left', style: this.prefix + 'tableRowContentStyle', border: [false, true, false, showBottomBorder] },
                    { text: recordsAffected, alignment: 'left', style: this.prefix + 'tableRowContentStyle', border: [false, true, false, showBottomBorder] },
                    { text: typeOfLoss, alignment: 'left', style: this.prefix + 'tableRowContentStyle', border: [false, true, true, showBottomBorder] }
                ];
                this.table.table.body.push(dataRow);
                if(this.hasDescriptionPermission) {
                    dataDescription = [
                        { text: caseDescription, colSpan: 5, style: this.prefix + 'tableRowContentDescriptionStyle', border: [true, false, true, true] }
                    ];
                    this.table.table.body.push(dataDescription);
                }
            }
        }
    }

    /**
     * get boolean value to indicate if page counting 
     * via pdf rendering is required.  
     * Defaults to false, which means the page object renders 
     * all in one page or have a way to keep track of the 
     * number of pages without pdf rendering
     * If true, only pdf rendering can determine the number of pages
     * 
     * @public
     * @function isPageCountingRequired
     * @return {boolean} - value to indicate if pdf rendering is needed to determine page count
     */
    public isPageCountingRequired(): boolean {
        return true;
    }

    //number of pages this page object will be render out to pdf
    //value is only value if you add this page object to pdfMakeBuilder object
    private pageCount: number = 0;

    /**
     * get the number of pages that this page object will be render out to the final pdf
     * 
     * @public
     * @function getPageCount
     * @return {number} - the number of pages that this page object will be render out to the final pdf
     */
    public getPageCount(): number {
        return this.pageCount;
    }

    /**
     * set the number of pages that this page object will be render out to the final pdf
     * 
     * @public
     * @function setPageCount
     * @param {number} pageCount - the number of pages that this page object will be render out to the final pdf
     * @return {} - No return types.
     */
    public setPageCount(pageCount: number) {
        this.pageCount = pageCount;
    }

};