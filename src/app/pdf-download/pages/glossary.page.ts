import { BasePage } from './base.page';
import { GlossaryTerm, GlossarySubTerm } from 'app/model/model';

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
    
    
    //json block for the glossary letter style
    private glossaryLetterStyle: any = {
        bold: true,
        color: "white",
        fontSize: 50,
        fillColor: '#464646'
    };

    //json block for the glossary term style
    private glossaryTermStyle: any = {
        bold: true,
        color: '#b1d23b',
        fontSize: 11
    };

    //json block for the glossary link style
    private glossaryLinkStyle: any = {
        bold: false,
        color: '#464646',
        fontSize: 11
    };

    //json block for the glossary child term style
    private glossarySubTermStyle: any = {
        bold: true,
        color: '#464646',
        fontSize: 11
    };

    //json block for the table row content description style
    private glossaryDefinitionStyle: any = {
        bold: false,
        color: '#464646',
        fontSize: 11
    };

    //json block for the table structure to hold row headers
    //we will dynamically add row at the end of the table at table.table.body array
    private table: any = {
        margin: [ 60, 20, 60, 0 ],
        table: {
            widths: ['10%', '90%'],
            body: [
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

    //object used to hold the table data
    private glossaryData: Array<GlossaryTerm>

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

        let i: number;
        let n: number = this.table.table.body.length;
        let tableRow: any;
        let letterColumn: any;
        let definitionTable: any;
        let style: string;

        for(i = 1; i < n; i++) {
            tableRow = this.table.table.body[i];
            letterColumn = tableRow[0];
            if(letterColumn.table) {
                letterColumn.table.body[0][0].style = this.prefix + 'glossaryLetterStyle';
            }
            definitionTable = tableRow[1];
            if(definitionTable.style) {
                //change style name for unordered list
                definitionTable.style = this.prefix + 'glossaryDefinitionStyle';
            } else if(definitionTable.table) {
                style = definitionTable.table.body[0][0].style;
                if(style.match(/glossarySubTermStyle$/)) {
                    //change style name for child term
                    definitionTable.table.body[0][0].style = this.prefix + 'glossarySubTermStyle';
                } else if(style.match(/glossaryTermStyle$/)) {
                    //change style name for top level term
                    definitionTable.table.body[0][0].style = this.prefix + 'glossaryTermStyle';
                } else if(style.match(/glossaryLinkStyle$/)) {
                    //change style name for top level term
                    definitionTable.table.body[0][0].style = this.prefix + 'glossaryLinkStyle';
                }
                //change style name for definition text
                definitionTable.table.body[1][0].style = this.prefix + 'glossaryDefinitionStyle';
            }
        }

        this.clearArray(this.styles);
        this.styles[this.prefix + 'headerStyle'] = this.headerStyle;
        this.styles[this.prefix + 'subHeaderStyle'] = this.subHeaderStyle;
        this.styles[this.prefix + 'glossaryLetterStyle'] = this.glossaryLetterStyle;
        this.styles[this.prefix + 'glossaryTermStyle'] = this.glossaryTermStyle;
        this.styles[this.prefix + 'glossaryLinkStyle'] = this.glossaryLinkStyle;
        this.styles[this.prefix + 'glossarySubTermStyle'] = this.glossarySubTermStyle;
        this.styles[this.prefix + 'glossaryDefinitionStyle'] = this.glossaryDefinitionStyle;

        this.clearArray(this.pdfContent);
        this.pdfContent.push(this.header);
        this.pdfContent.push(this.subHeader);
        this.pdfContent.push(this.table);
    }

    /**
     * Build json table cell for the unordered lists
     * 
     * @private
     * @function buildListEntry
     * @param {string[]} list - list of bulleted items
     * @return {any} - json table cell
     */
    private buildListEntry(list: string[]): any {

        let tableCell: any = [
            {text: ''},
            {
                margin: [20, 0, 0, 0],
                style: this.prefix + 'glossaryDefinitionStyle',
                table: {
                    widths: ['2%', '98%'],
                    body: [
                        [
                            {text: ''},
                            {
                                ul: list
                            }
                        ]
                    ]
                },
                layout: 'noBorders'
            }
        ];
        return tableCell;
    }

    /**
     * set the table data object and load it content 
     * into the current page object
     * 
     * @public
     * @function setGlossaryData
     * @param {Array<GlossaryTerm>string} glossaryData - table data
     * @return {} - No return types.
     */
    public setGlossaryData(glossaryData: Array<GlossaryTerm>) {
        this.glossaryData = glossaryData;
        let i: number;
        let j: number;
        let n1: number = this.glossaryData.length;
        let n2: number;
        let dataRow: any;
        let currentLetter: string = '';
        let glossaryTerm: GlossaryTerm;
        let firstColumn: any;
        let topMargin: number;
        let glossarySubTerm: GlossarySubTerm;
        let buttonList: Array<string> = [];

        if(n1 == 0) {
            dataRow = [{text:''},{text:''}];
            this.table.table.body.push(dataRow);
        } else {
            for(i = 0; i < n1; i++) {
                glossaryTerm = glossaryData[i];
                buttonList.length = 0;
                if(currentLetter !== glossaryTerm.letter) {
                    firstColumn = {
                        table: {
                            widths: [58],
                            body: [
                                [
                                    { text: glossaryTerm.letter, alignment: 'center', style: this.prefix + 'glossaryLetterStyle' }
                                ]
                            ]
                        },
                        layout: 'noBorders'
                    };
                    topMargin = 10;
                } else {
                    firstColumn = { text: '' };
                    topMargin = 0;
                }
                currentLetter = glossaryTerm.letter;
                dataRow = [
                    firstColumn,
                    {
                        margin: [20, topMargin, 0, 0],
                        table: {
                            body: [
                                [
                                    { text: glossaryTerm.term, alignment: 'left', style: this.prefix + 'glossaryTermStyle' }
                                ],
                                [
                                    { text: glossaryTerm.definition, alignment: 'left', style: this.prefix + 'glossaryDefinitionStyle' }
                                ],
                                [
                                    { text: (glossaryTerm.link) ? glossaryTerm.link : '' , alignment: 'left', style: this.prefix + 'glossaryLinkStyle' }
                                ],
                            ]
                        },
                        layout: 'noBorders'
                    }
                ];
                this.table.table.body.push(dataRow);
                if(glossaryTerm.subComponents) {
                    n2 = glossaryTerm.subComponents.length;
                    for(j = 0; j < n2; j++) {
                        glossarySubTerm = glossaryTerm.subComponents[j];
                        if(glossarySubTerm.type == 'C') {
                            if(buttonList.length > 0) {
                                dataRow = this.buildListEntry(buttonList);
                                this.table.table.body.push(dataRow);
                                buttonList = [];
                            }
                            dataRow = [
                                { text: '' },
                                {
                                    margin: [20, 0, 0, 0],
                                    table: {
                                        body: [
                                            [
                                                { text: glossarySubTerm.term, alignment: 'left', style: this.prefix + 'glossarySubTermStyle' }
                                            ],
                                            [
                                                { text: glossarySubTerm.definition, alignment: 'left', style: this.prefix + 'glossaryDefinitionStyle' }
                                            ]
                                        ]
                                    },
                                    layout: 'noBorders'
                                }
                            ];
                            this.table.table.body.push(dataRow);
                        } else if(glossarySubTerm.type == 'B') {
                            buttonList.push(glossarySubTerm.definition);
                        }
                    }
                    if(buttonList.length > 0) {
                        dataRow = this.buildListEntry(buttonList);
                        this.table.table.body.push(dataRow);
                        buttonList = [];
                    }
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