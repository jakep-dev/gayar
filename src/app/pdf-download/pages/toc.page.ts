import { BasePage } from './base.page';
import { ComponentPrintSettings } from 'app/model/model';

export class TOCPage extends BasePage  {

    //page type name for this page
    public static pageType:string = 'TOCPage';
    private static FIRST_PAGE_TOC_ITEM_COUNT = 23;
    private static TOC_ITEM_COUNT_PER_PAGE = 25;

    //default page prefix of this page to prevent json object names from one page don't clash with other pages
    private prefix: string = TOCPage.pageType + '_';

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
        return TOCPage.pageType;
    }
    
    //Associative array of styles for toc page
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

    //table of contents item style json objects
    private tocStyle1: any = {
        color: '#27a9bc',
        fontSize: 22,
        bold: true
    };
    
    private tocStyle2: any = {
        color: '#b1d23b',
        fontSize: 22,
        bold: true,
        italics: true
    };

    private tocLevel1Style: any = {
        color: 'black',
        fontSize: 10,
        bold: true
    };

    private tocLevel2Style: any = {
        color: '#7f7f7f',
        fontSize: 10
    };

    private tocLevel3Style: any = {
        color: 'black',
        fontSize: 10
    };

    //Page header json object
    private header: any = {
        text: [
            {
                text: "TABLE",
                style: this.prefix + "tocStyle1"
            },
            {
                text: " of ",
                style: this.prefix + "tocStyle2"
            },
            {
                text: "CONTENTS",
                style: this.prefix + "tocStyle1"
            }
        ],
        margin: [60,0,0,0]
    };

    //table of contents json object
    private toc: any = {
        margin: [60, 5, 60, 10],
        table: {
            widths: ['2.5%', '2.5%', '92%', '3%'],
            body: [
            ]
        },
        layout: 'noBorders',
        pageBreak: 'after'
    };

    //Array of toc items
    tocList: Array<any> = [];

    //Associative array that maps page type to an array of toc items
    pageMapping: Array<any> = [];

    //Associative array that maps page type to an array of objects containing toc description and page offset
    pageChartOffset: Array<any> = [];

    /**
     * Add a table of contents item to page object
     * 
     * @public
     * @function addTocEntry
     * @param {string} title - toc item title
     * @param {string} level - indentation level of the toc item
     * @param {string} pageType - page type
     * @return {} - No return types.
     */
    public addTocEntry(title: string, level: number, pageType: string) {
        let tocItem: any;
        let subTable: any;
        let titleLength = title.length * 5.5;
        switch(level) {
            case 1:
                subTable = {
                    //660 width of toc entry
                    widths: [titleLength, 660 - titleLength],
                    body: [
                        [
                            {
                                text: title,
                                style: this.prefix + 'tocLevel1Style',
                                noWrap: true
                            },
                            {
                                text: ' ..........................................................................................................................................................................................................................................................................',
                                style: this.prefix + 'tocLevel1Style',
                                noWrap: false,
                                maxHeight: 15
                            }
                        ]
                    ]
                };
                tocItem = [
                    {
                        table: subTable,
                        layout: 'noBorders',
                        colSpan: 3
                    },
                    {
                        text: ''
                    },
                    {
                        text: ''
                    },
                    {
                        text: '*',
                        linkToPage: 1,
                        style: this.prefix + 'tocLevel1Style'
                    }
                ];
                break;
            case 2:
            subTable = {
                //635 width of toc entry
                widths: [titleLength, 635 - titleLength],
                body: [
                    [
                        {
                            text: title,
                            style: this.prefix + 'tocLevel2Style',
                            noWrap: true
                        },
                        {
                            text: ' ..........................................................................................................................................................................................................................................................................',
                            style: this.prefix + 'tocLevel2Style',
                            noWrap: false,
                            maxHeight: 15
                        }
                    ]
                ]
            };
            tocItem = [
                    {
                        text: ''
                    },
                    {
                        table: subTable,
                        layout: 'noBorders',
                        colSpan: 2
                    },
                    {
                        text: ''
                    },
                    {
                        text: '*',
                        linkToPage: 1,
                        style: this.prefix + 'tocLevel2Style'
                    }
                ];
                break;
            case 3:
                subTable = {
                    //610 width of toc entry
                    widths: [titleLength, 610 - titleLength],
                    body: [
                        [
                            {
                                text: title,
                                style: this.prefix + 'tocLevel3Style',
                                noWrap: true
                            },
                            {
                                text: ' ..........................................................................................................................................................................................................................................................................',
                                style: this.prefix + 'tocLevel3Style',
                                noWrap: false,
                                maxHeight: 15
                            }
                        ]
                    ]
                };
                tocItem = [
                    {
                        text: ''
                    },
                    {
                        text: ''
                    },
                    {
                        table: subTable,
                        layout: 'noBorders'
                    },
                    {
                        text: '*',
                        linkToPage: 1,
                        style: this.prefix + 'tocLevel3Style'
                    }
                ];
                break;
            default:
                break;
        }
        if(tocItem) {
            this.tocList.push(tocItem);
            this.toc.table.body.push(tocItem);
            let pageMappingList: any = this.pageMapping[pageType];
            if(!pageMappingList) {
                pageMappingList = this.pageMapping[pageType] = [];
            }
            pageMappingList.push(tocItem);
        }
    }

    /**
     * Save multipage page offsets for page objects that render to multiple pdf pages
     * 
     * @public
     * @function registerTOCPageOffset
     * @param {string} tocDescription - table of contents item label
     * @param {string} pageType - page type name
     * @param {number} offSet - the page number within the page object for which toc item label is being mapped to
     * @return {} - No return types.
     */
    public registerTOCPageOffset(tocDescription: string, pageType: string, offSet: number) {
        let pageOffset: any = this.pageChartOffset[pageType];
        if(!pageOffset) {
            pageOffset = this.pageChartOffset[pageType] = [];
        }
        pageOffset.push({
            tocDescription: tocDescription,
            offSet: offSet
        });
    }

    /**
     * Update table of contents items with the input page type name
     * 
     * @public
     * @function setPageNumber
     * @param {string} pageType - page type name
     * @param {number} pageNumber - page number for the specified page type
     * @return {} - No return types.
     */
    public setPageNumber(pageType: string, pageNumber: number) {
        let pageMappingList: any = this.pageMapping[pageType];
        let pageOffSet: any = this.pageChartOffset[pageType];
        let i: number;
        let j: number;
        let tocItem: any;
        let tocTable: any;
        let tocDescription: string;
        let tocOffset: any;
        let basePageNumber: number = pageNumber;

        if(pageMappingList) {
            for(i = 0; i < pageMappingList.length; i++) {
                tocItem = pageMappingList[i];
                //if page object can be rendered past the first page
                //calculate offset to match page number to toc item description
                if(pageOffSet) {
                    tocTable = tocItem[0].table || tocItem[1].table || tocItem[2].table;
                    tocDescription = tocTable.body[0][0].text;
                    tocOffset = pageOffSet.find(f => f.tocDescription === tocDescription);
                    if(tocOffset) {
                        pageNumber = basePageNumber + tocOffset.offSet - 1;
                    }
                }
                tocItem[3].text = pageNumber;
                tocItem[3].linkToPage = pageNumber;
            }
        }
    }

    /**
     * clear all the table of content items
     * 
     * @public
     * @function clearTOC
     * @return {} - No return types.
     */
    public clearTOC() {
        this.clearArray(this.styles);
        this.clearArray(this.pdfContent);
        this.clearArray(this.pageMapping);
        this.clearArray(this.pageChartOffset);
        this.toc.table.body.length = 0;
        this.clearArray(this.tocList);
        this.updatePdfContent();
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

    /**
     * Update style names, image names when the page prefix changes
     * 
     * @private
     * @function updatePdfContent
     * @return {} - No return types.
     */
    private updatePdfContent() {
        this.header.text[0].style = this.prefix + "tocStyle1";
        this.header.text[1].style = this.prefix + "tocStyle2";
        this.header.text[2].style = this.prefix + "tocStyle1";

        let tocItem: any;
        this.tocList.forEach(tocItem => 
            {
                if(tocItem[0].text) {
                    tocItem[0].table.body[0][0].style = this.prefix + 'tocLevel1Style';
                    tocItem[0].table.body[0][1].style = this.prefix + 'tocLevel1Style';
                    tocItem[3].style = this.prefix + 'tocLevel1Style';
                } else if(tocItem[1].text) {
                    tocItem[1].table.body[0][0].style = this.prefix + 'tocLeve21Style';
                    tocItem[1].table.body[0][1].style = this.prefix + 'tocLeve21Style';
                    tocItem[3].style = this.prefix + 'tocLevel2Style';
                } else if(tocItem[2].text) {
                    tocItem[2].table.body[0][0].style = this.prefix + 'tocLevel3Style';
                    tocItem[2].table.body[0][1].style = this.prefix + 'tocLevel3Style';
                    tocItem[3].style = this.prefix + 'tocLevel3Style';
                }
            }
        );

        this.clearArray(this.styles);
        this.styles[this.prefix + 'tocStyle1'] = this.tocStyle1;
        this.styles[this.prefix + 'tocStyle2'] = this.tocStyle2;
        this.styles[this.prefix + 'tocLevel1Style'] = this.tocLevel1Style;
        this.styles[this.prefix + 'tocLevel2Style'] = this.tocLevel2Style;
        this.styles[this.prefix + 'tocLevel3Style'] = this.tocLevel3Style;

        this.clearArray(this.pdfContent);
        this.pdfContent.push(this.header);
        this.pdfContent.push(this.toc);
    }

    /**
     * get the page count for the current page object
     * 
     * @public
     * @function getPageCount
     * @return {number} - number of pages this page object will render out to
     */
    public getPageCount(): number {
        //the toc should be two pages or less
        if(this.tocList.length <= TOCPage.FIRST_PAGE_TOC_ITEM_COUNT) {
            return 1;
        } else {
            return 1 + Math.ceil((this.tocList.length - TOCPage.FIRST_PAGE_TOC_ITEM_COUNT) / TOCPage.TOC_ITEM_COUNT_PER_PAGE);
        }
    }

    constructor() {
        super();
        this.updatePdfContent();
    }
};