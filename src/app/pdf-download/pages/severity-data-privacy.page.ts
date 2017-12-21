import { BasePage } from './base.page';
import { ComponentPrintSettings } from 'app/model/model';

export class SeverityDataPrivacyPage extends BasePage  {

    public static pageType:string = 'SeverityDataPrivacyPage';

    private prefix: string = SeverityDataPrivacyPage.pageType + '_';

    public getPrefix() {
        return this.prefix;
    }

    public setPrefix(prefix: string) {
        this.prefix = prefix;
        this.updatePdfContent();
    }

    public getPageType(): string {
        return SeverityDataPrivacyPage.pageType;
    }
    
    private headerStyle: any = {
        color: '#464646',
        fontSize: 12,
        bold: true,
        margin: [ 60, 0, 40, 0]
    };

    private header: any = {
        text: 'Data Privacy',
        style: this.prefix + 'headerStyle'
    };

    private imageLeft:string = '';
    private imageLeftUrl:string = '';
    private imageRight:string = '';
    private imageRightUrl:string = '';
    
    private table: any = {
        margin: [ 30, 20, 70, 0 ],
        table: {
            heights: [ 400 ],
            body: [              
                [
                    {
                        image: this.imageLeft,
                        width: 375
                    },
                    {
                        image: this.imageRight,
                        width: 375
                    }
                ]
            ]
        },
        layout: 'noBorders',
        pageBreak: 'after'
    };

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

    constructor() {
        super();
        this.updatePdfContent();
    }

    public getPrintSettings(componentOrder: number) : ComponentPrintSettings {
        //all charts in this page type are the same size
        return {
            width: 550,
            height: 400,
            drillDown: ''
        };
    }

    public addChartLabel(index: number, chartName: string, chartDataUrl: string): number {
        if(index >= 0 && index <= 1) {
            chartName = chartName.replace('-','_');
            let imageName = this.prefix + chartName;
            this.table.table.body[0][index].image = imageName;
            switch(index) {
                case 0:
                    this.imageLeft = chartName;
                    this.imageLeftUrl = chartDataUrl
                    break;
                case 1:
                    this.imageRight = chartName;
                    this.imageRightUrl = chartDataUrl
                    break;

                default:
                    break;
            }
            this.images[imageName] = chartDataUrl;
        }
        //all content added are on first page
        return 1;
    }

    private updatePdfContent() {

        this.header.style = this.prefix + 'headerStyle';
        
        this.clearArray(this.styles);
        this.styles[this.prefix + 'headerStyle'] = this.headerStyle;

        this.clearArray(this.images);
        if(this.imageLeftUrl) {
            this.images[this.prefix + this.imageLeft] = this.imageLeftUrl;
        }
        if(this.imageRightUrl) {
            this.images[this.prefix + this.imageRight] = this.imageRightUrl;
        }

        this.table.table.body[0][0].image = this.prefix + this.imageLeft;
        this.table.table.body[0][1].image = this.prefix + this.imageRight;

        this.clearArray(this.pdfContent);
        this.pdfContent.push(this.header);
        this.pdfContent.push(this.table);
    }
};