import { BasePage } from './base.page';
import { ComponentPrintSettings } from 'app/model/model';

export class FrequencyTypeOfIncidentPage extends BasePage  {

    public static pageType:string = 'FrequencyTypeOfIncidentPage';

    private prefix: string = FrequencyTypeOfIncidentPage.pageType + '_';

    public getPrefix() {
        return this.prefix;
    }

    public setPrefix(prefix: string) {
        this.prefix = prefix;
        this.updatePdfContent();
    }

    public getPageType(): string {
        return FrequencyTypeOfIncidentPage.pageType;
    }
    
    private headerStyle: any = {
        color: '#b1d23b',
        fontSize: 14,
        bold: true,
        margin: [60,0,40,0]
    };

    private header: any = {
        text: 'Type of Incident',
        style: this.prefix + 'headerStyle'
    };

    private tableHeaderStyle: any = {
        color: '#464646',
        fontSize: 12,
        bold: true
    };

    private imageLeft:string = '';
    private imageLeftUrl:string = '';
    private imageRight:string = '';
    private imageRightUrl:string = '';

    private table: any = {
        margin: [ 60, 20, 70, 0 ],
        table: {
            heights: [ 15, 400 ],
            body: [
                [
                    { text: 'Overview', alignment: 'left', style: this.prefix + 'tableHeaderStyle' }, 
                    { text: '' }
                ],                
                [
                    {
                        image: this.imageLeft,
                        width: 375,
                        margin: [ -30, 0, 0, 0 ]
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
            this.table.table.body[1][index].image = imageName;
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
        this.table.table.body[0][0].style = this.prefix + 'tableHeaderStyle';
        
        this.clearArray(this.styles);
        this.styles[this.prefix + 'headerStyle'] = this.headerStyle;
        this.styles[this.prefix + 'tableHeaderStyle'] = this.tableHeaderStyle;

        this.clearArray(this.images);
        if(this.imageLeftUrl) {
            this.images[this.prefix + this.imageLeft] = this.imageLeftUrl;
        }
        if(this.imageRightUrl) {
            this.images[this.prefix + this.imageRight] = this.imageRightUrl;
        }

        this.table.table.body[1][0].image = this.prefix + this.imageLeft;
        this.table.table.body[0][1].image = this.prefix + this.imageRight;

        this.clearArray(this.pdfContent);
        this.pdfContent.push(this.header);
        this.pdfContent.push(this.table);
    }
};