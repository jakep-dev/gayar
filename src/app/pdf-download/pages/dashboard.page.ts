import { BasePage } from './base.page';
import { ComponentPrintSettings } from 'app/model/pdf.model';

export class DashboardPage extends BasePage  {

    private prefix: string = 'dashboardPage_';

    public getPrefix() {
        return this.prefix;
    }

    public setPrefix(prefix: string) {
        this.prefix = prefix;
        this.updatePdfContent();
    }

    private headerStyle: any = {
        color: '#27a9bc',
        fontSize: 16,
        bold: true,
        margin: [60,0,40,0]
    };

    private header: any = {
        text: 'Dashboard',
        style: this.prefix + 'headerStyle'
    };

    private tableHeaderStyle: any = {
        color: '#b1d23b',
        fontSize: 14,
        bold: true
    };

    private imageLeft:string = '';
    private imageLeftUrl:string = '';
    private imageMiddle:string = '';
    private imageMiddleUrl:string = '';
    private imageRight:string = '';
    private imageRightUrl:string = '';
    
    private table: any = {
        margin: [ 35, 20, 70, 0 ],
        table: {
            heights: [ 15, 300 ],
            body: [
                [
                    { text: 'Frequency', alignment: 'center', style: this.prefix + 'tableHeaderStyle' }, 
                    { text: 'Severity', alignment: 'center', style: this.prefix + 'tableHeaderStyle' }, 
                    { text: 'Benchmark', alignment: 'center', style: this.prefix + 'tableHeaderStyle' }
                ],                
                [
                    {
                        image: this.imageLeft,
                        //height: 460,
                        width: 240
                    },
                    {
                        image: this.imageMiddle,
                        //height: 460,
                        width: 240
                    },
                    {
                        image: this.imageRight,
                        //height: 460,
                        width: 240
                    }
                ],
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
            width: 400,
            height: 400,
            drillDown: ''
        };
    }

    public addChartLabel(index: number, chartName: string, chartDataUrl: string) {
        if(index >= 0 && index <= 2) {
            chartName = chartName.replace('-','_');
            let imageName = this.prefix + chartName;
            this.table.table.body[1][index].image = imageName;
            switch(index) {
                case 0:
                    this.imageLeft = chartName;
                    this.imageLeftUrl = chartDataUrl
                    break;
                case 1:
                    this.imageMiddle = chartName;
                    this.imageMiddleUrl = chartDataUrl;
                break;
                case 2:
                    this.imageRight = chartName;
                    this.imageRightUrl = chartDataUrl;
                break;
                default:
                    break;
            }
            this.images[imageName] = chartDataUrl;
        }
    }

    private clearArray(array: Array<any>) {
        array.length = 0;
        for(let item in array) {
            console.log('Deleting key ' + item);
            delete array[item];
        }
    }

    private updatePdfContent() {

        this.header.style = this.prefix + 'headerStyle';
        this.table.table.body[0][0].style = this.prefix + 'tableHeaderStyle';
        this.table.table.body[0][1].style = this.prefix + 'tableHeaderStyle';
        this.table.table.body[0][2].style = this.prefix + 'tableHeaderStyle';
        
        this.clearArray(this.styles);
        this.styles[this.prefix + 'headerStyle'] = this.headerStyle;
        this.styles[this.prefix + 'tableHeaderStyle'] = this.tableHeaderStyle;

        this.clearArray(this.images);
        if(this.imageLeftUrl) {
            this.images[this.prefix + this.imageLeft] = this.imageLeftUrl;
        }
        if(this.imageMiddleUrl) {
            this.images[this.prefix + this.imageMiddle] = this.imageMiddleUrl;    
        }
        if(this.imageRightUrl) {
            this.images[this.prefix + this.imageRight] = this.imageRightUrl;    
        }

        this.table.table.body[1][0].image = this.prefix + this.imageLeft;
        this.table.table.body[1][1].image = this.prefix + this.imageMiddle;
        this.table.table.body[1][2].image = this.prefix + this.imageRight;

        this.clearArray(this.pdfContent);
        this.pdfContent.push(this.header);
        this.pdfContent.push(this.table);
    }
};