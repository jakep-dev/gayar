import { BasePage } from './base.page';
import { ComponentPrintSettings } from 'app/model/pdf.model';

export class TOCPage extends BasePage  {

    private prefix: string = 'tocPage_';

    public getPrefix() {
        return this.prefix;
    }

    public setPrefix(prefix: string) {
        this.prefix = prefix;
        this.updatePdfContent();
    }

    private styles: Array<any> = [];

    public getStyles(): Array<any> {
        return this.styles;
    }

    private tocStyle1: any = {
        color: '#7a9bc',
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

    tocList: Array<any> = [];

    pageMapping: Array<any> = [];

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

    public setPageNumber(pageType: string, pageNumber: number) {
        let pageMappingList: any = this.pageMapping[pageType];
        if(pageMappingList) {
            pageMappingList.forEach(tocItem => 
                {
                    tocItem[3].text = pageNumber;
                    tocItem[3].linkToPage = pageNumber;
                }
            );
        }
    }

    public clearTOC() {
        this.clearArray(this.styles);
        this.clearArray(this.pdfContent);
        this.clearArray(this.pageMapping);
        this.toc.table.body.length = 0;
        this.clearArray(this.tocList);
        this.clearArray(this.pageMapping);
        this.updatePdfContent();
    }

    private pdfContent: Array<any> = [];

    public getPdfContent(): Array<any> {
        return this.pdfContent;
    }

    private clearArray(array: Array<any>) {
        array.length = 0;
        for(let item in array) {
            console.log('Deleting key ' + item);
            delete array[item];
        }
    }

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

    constructor() {
        super();
        this.updatePdfContent();
    }
};