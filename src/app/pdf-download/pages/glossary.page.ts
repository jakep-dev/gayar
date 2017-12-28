import { BasePage } from './base.page';
import { IGlossaryTermModel, ISubGlossaryTermModel } from 'app/model/model';

export class GlossaryPage extends BasePage  {

    static list_separator: string = '<list>';
    //page type name for this page
    public static pageType:string = 'GlossaryPage';

    //default page prefix of this page to prevent json object names from one page don't clash with other pages
    private prefix: string = GlossaryPage.pageType + '_';

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
        return GlossaryPage.pageType;
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
        text: 'Appendix',
        style: this.prefix + 'headerStyle'
    };

    private subHeaderStyle: any = {
        color: '#b1d23b',
        fontSize: 14,
        bold: true,
        margin: [ 60, 20, 40, 0]
    };

    private subHeader: any = {
        text: 'Glossary',
        style: this.prefix + 'subHeaderStyle'
    };
    
    
    //json block for the table header style
    private tableHeaderStyle: any = {
        bold: true,
        color: "white",
        fontSize: 11,
        fillColor: 'black'
    };

    //json block for the glossary term style
    private glossaryTerm: any = {
        bold: true,
        color: '#464646',
        fontSize: 11
    };

    //json block for the table row content description style
    private glossaryDefinition: any = {
        bold: false,
        color: '#464646',
        fontSize: 11
    };

    //json block for the table structure to hold row headers
    //we will dynamically add row at the end of the table at table.table.body array
    private table: any = {
        margin: [ 60, 20, 60, 0 ],
        table: {
            headerRows: 1,
            //widths: ['18%','18%','13%','18%','18%'],
            widths: ['2%', '33%', '50%'],
            body: [
                    [
                        {text: 'Term', alignment: 'left', style: this.prefix + 'tableHeaderStyle', colSpan: 2}, 
                        {text: ''}, 
                        {text: 'Definition', alignment: 'left', style: this.prefix + 'tableHeaderStyle'}
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
    private glossaryData: Array<IGlossaryTermModel>

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
        this.subHeader.style = this.prefix + 'subHeaderStyle';
        this.table.table.body[0][0].style = this.prefix + 'tableHeaderStyle';
        this.table.table.body[0][2].style = this.prefix + 'tableHeaderStyle';

        let i: number;
        let n: number = this.table.table.body.length;
        let tableRow: any;
        for(i = 1; i < n; i++) {
            tableRow = this.table.table.body[i];
            if(tableRow[0].text){
                tableRow[0].style = this.prefix + 'glossaryTerm';
            }
            if(tableRow[1].text){
                tableRow[1].style = this.prefix + 'glossaryTerm';
            }
            tableRow[2].style = this.prefix + 'glossaryDefinition';
        }

        this.clearArray(this.styles);
        this.styles[this.prefix + 'headerStyle'] = this.headerStyle;
        this.styles[this.prefix + 'subHeaderStyle'] = this.subHeaderStyle;
        this.styles[this.prefix + 'tableHeaderStyle'] = this.tableHeaderStyle;
        this.styles[this.prefix + 'glossaryTerm'] = this.glossaryTerm;
        this.styles[this.prefix + 'glossaryDefinition'] = this.glossaryDefinition;

        this.clearArray(this.pdfContent);
        this.pdfContent.push(this.header);
        this.pdfContent.push(this.subHeader);
        this.pdfContent.push(this.table);
    }

    /**
     * Build json table cell for the based on definition text
     * if text contains the <list\> marker, build unordered list into table cell
     * 
     * @private
     * @function buildDefinitionBlock
     * @param {string} definition - glossary definition
     * @param {string[]} list - list of bulleted items
     * @return {any} - json table cell
     */
    private buildDefinitionBlock(definition: string, list: string[]): any {

        let pos: number = definition.indexOf(GlossaryPage.list_separator);
        if(pos >= 0) {
            let definitionParts: string[] = definition.split(GlossaryPage.list_separator);
            let i: number;
            let n: number = definitionParts.length;
            let tableCell: any;    

            tableCell = {
                style: this.prefix + 'glossaryDefinition',
                table: {
                    widths: ['2%', '98%'],
                    body: [
                        [
                            {
                                text: definitionParts[0],
                                colSpan: 2
                            },
                            {text: ''}
                        ],
                        [
                            {text: ''},
                            {
                                ul: [
                                ]
                            }
                        ]
                    ]
                },
                layout: 'noBorders',
                border: [false, true, true, true]
            };

            for(i = 1; i < n; i++) {
                tableCell.table.body.push(
                    [
                            {
                                text: definitionParts[i],
                                colSpan: 2
                            },
                            {text: ''}
                    ]
                );
            }

            if(list) {
                n = list.length;
                for(i = 0; i < n; i++) {
                    tableCell.table.body[1][1].ul.push(list[i]);
                }
            }
            return tableCell;
        } else {
            return { text: definition, alignment: 'left', style: this.prefix + 'glossaryDefinition', border: [false, true, true, true] };
        }
    }

    /**
     * set the table data object and load it content 
     * into the current page object
     * 
     * @public
     * @function setGlossaryData
     * @param {Array<IGlossaryTermModel>string} glossaryData - table data
     * @return {} - No return types.
     */
    public setGlossaryData(glossaryData: Array<IGlossaryTermModel>) {
        this.glossaryData = glossaryData;
        this.table.table.body.length = 1;
        let i: number;
        let j: number;
        let n1: number = this.glossaryData.length;
        let n2: number;
        let term: string;
        let definition: string;
        let dataRow: any;

        for(i = 0; i < n1; i++) {
            term = (this.glossaryData[i].term != null) ? this.glossaryData[i].term : '';
            definition = (this.glossaryData[i].term != null) ? this.glossaryData[i].definition : '';
            dataRow = [
                { text: term, alignment: 'left', style: this.prefix + 'glossaryTerm', border: [true, true, false, true], colSpan: 2 },
                { text: ''},
                this.buildDefinitionBlock(definition, this.glossaryData[i].list)
            ];
            this.table.table.body.push(dataRow);
            if(this.glossaryData[i].subComponents) {
                n2 = this.glossaryData[i].subComponents.length;
                for(j = 0; j < n2; j++) {
                    term = (this.glossaryData[i].subComponents[j].term != null) ? this.glossaryData[i].subComponents[j].term : '';
                    definition = (this.glossaryData[i].subComponents[j].term != null) ? this.glossaryData[i].subComponents[j].definition : '';
                    dataRow = [
                        { text: '', fillColor: 'black' }, 
                        { text: term, alignment: 'left', style: this.prefix + 'glossaryTerm', border: [true, true, false, true] },
                        this.buildDefinitionBlock(definition, this.glossaryData[i].subComponents[j].list)
                    ];
                    this.table.table.body.push(dataRow);
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