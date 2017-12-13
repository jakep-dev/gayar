import { DatePipe } from '@angular/common';

import { BasePage } from './base.page';
import { GetFileService } from 'app/services/services';

export class CoverPage extends BasePage  {

    private fileService: GetFileService;
    private logoDataUrl: string;

    private prefix: string = 'coverPage_';

    public getPrefix() {
        return this.prefix;
    }

    public setPrefix(prefix: string) {
        this.prefix = prefix;
        this.updatePdfContent();
    }
    
    private clearArray(array: Array<any>) {
        array.length = 0;
        for(let item in array) {
            console.log('Deleting key ' + item);
            delete array[item];
        }
    }

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

    private pdfContent: Array<any> = [];

    public getPdfContent(): Array<any> {
        return this.pdfContent;
    }

    private styles: Array<any> = [];

    public getStyles(): Array<any> {
        return this.styles;
    }

    private images: Array<string> = [];

    public getImages(): Array<string> {
        return this.images;
    }

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

    private companyNameTextObject = {
        text: '<Company Name>',
        style: this.prefix + 'style3',
        border: [false, false, false, false]
    };

    public setCompanyName(name: string) {
        this.companyNameTextObject.text = name;
    }

    private industryTextObject = {
        text: '<Industry>',
        style: this.prefix + 'style4',
        border: [false, false, false, false]
    };

    public setIndustryName(name: string) {
        this.industryTextObject.text = name;
    }

    private revenueRangeTextObject = {
        text: '<Revenue Range>',
        style: this.prefix + 'style4',
        border: [false, false, false, false]
    };

    public setRevenueRangeText(text: string) {
        this.revenueRangeTextObject.text = text;
    }

    private userCompanyTextObject =  {
        text: '<Company Name of the user>',
    };

    public setUserCompanyName(name: string) {
        this.userCompanyTextObject.text = name;
    }

    private dateGeneratedTextObject = {
        text: '<Date Generated>',
        style: this.prefix + 'style5',
        border: [false, false, false, false]
    };

    private setReportDate(){
        let  dp = new DatePipe('en-US');
        this.dateGeneratedTextObject.text = dp.transform(new Date(), 'MMMM d, yyyy');
    }

    constructor() {
        super();
        this.setReportDate();
        this.updatePdfContent();
    }

    public setFileService(fileService: GetFileService) {
        this.fileService = fileService;
        this.fileService.getAsDataUrl('/assets/images/advisen-logo.png');
        this.fileService.fileData$.subscribe(this.updateAdvisenLogo.bind(this));
    }

    private updateAdvisenLogo(dataUrl: string) {
        this.logoDataUrl = dataUrl;
        this.images[this.prefix + 'logo'] = this.logoDataUrl;
    }
}