import { DatePipe } from '@angular/common';

import { BasePage } from './base.page';
import { GetFileService } from 'app/services/services';

export class CoverPage extends BasePage  {

    fileService: GetFileService;
    logoDataUrl: string;

    prefix: string = 'coverPage-';

    getPrefix() {
        return this.prefix;
    }

    setPrefix(prefix: string) {
        this.prefix = prefix;
        this.updatePdfContent();
    }
    
    updatePdfContent() {
        this.companyNameTextObject.style = this.prefix + 'style3';
        this.industryTextObject.style = this.prefix + 'style4';
        this.revenueRangeTextObject.style = this.prefix + 'style4';
        this.dateGeneratedTextObject.style = this.prefix + 'style5';

        this.images = [];
        this.images[this.prefix + 'logo'] = this.logoDataUrl;

        this.styles = [];
        this.styles[this.prefix + 'table1'] = this.table1;
        this.styles[this.prefix + 'table2'] = this.table2;
        this.styles[this.prefix + 'style1'] = this.style1;
        this.styles[this.prefix + 'style2'] = this.style2;
        this.styles[this.prefix + 'style3'] = this.style3;
        this.styles[this.prefix + 'style4'] = this.style4;
        this.styles[this.prefix + 'style5'] = this.style5;
        
        this.pdfContent =  [
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
            },	    
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
            },
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
        ];
    }

    pdfContent: any;

    styles: any;

    images: any;

    table1: any = {
        fillColor: '#464646',
        margin: [0,-3,0,0],
        alignment: 'center'
    };

    table2: any = {
        fillColor: 'white',
        alignment: 'right'
    };

    style1: any =  {
        color: 'white',
        fontSize: 28,
        bold: true
    };

    style2: any = {
        color: '#b1d23b',
        fontSize: 28,
        italics: true
    };

    style3: any = {
        color: 'white',
        fontSize: 28
    };

    style4: any = {
        color: 'white',
        fontSize: 20
    };

    style5: any = {
        color: 'white',
        fontSize: 14
    };

    companyNameTextObject = {
        text: '<Company Name>',
        style: this.prefix + 'style3',
        border: [false, false, false, false]
    };

    setCompanyName(name: string) {
        this.companyNameTextObject.text = name;
    }

    industryTextObject = {
        text: '<Industry>',
        style: this.prefix + 'style4',
        border: [false, false, false, false]
    };

    setIndustryName(name: string) {
        this.industryTextObject.text = name;
    }

    revenueRangeTextObject = {
        text: '<Revenue Range>',
        style: this.prefix + 'style4',
        border: [false, false, false, false]
    };

    setRevenueRangeText(text: string) {
        this.revenueRangeTextObject.text = text;
    }

    userCompanyTextObject =  {
        text: '<Company Name of the user>',
    };

    setUserCompanyName(name: string) {
        this.userCompanyTextObject.text = name;
    }

    dateGeneratedTextObject = {
        text: '<Date Generated>',
        style: this.prefix + 'style5',
        border: [false, false, false, false]
    };

    setReportDate(){
        let  dp = new DatePipe('en-US');
        this.dateGeneratedTextObject.text = dp.transform(new Date(), 'MMMM d, yyyy');
    }

    constructor() {
        super();
        this.setReportDate();
        this.updatePdfContent();
    }

    setFileService(fileService: GetFileService) {
        this.fileService = fileService;
        this.fileService.getAsDataUrl('/assets/images/advisen-logo.png');
        this.fileService.fileData$.subscribe(this.updateAdvisenLogo.bind(this));
    }

    private updateAdvisenLogo(dataUrl: string) {
        this.logoDataUrl = dataUrl;
    }
}