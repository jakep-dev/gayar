import { BasePage } from './base.page';
import { ComponentPrintSettings } from 'app/model/model';

export class DashboardPage extends BasePage  {

    public static pageType:string = 'DashboardPage';

    private prefix: string = DashboardPage.pageType + '_';

    public getPrefix() {
        return this.prefix;
    }

    public setPrefix(prefix: string) {
        this.prefix = prefix;
        this.updatePdfContent();
    }

    public getPageType(): string {
        return DashboardPage.pageType;
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
                    { text: '', alignment: 'center', style: this.prefix + 'tableHeaderStyle' }, 
                    { text: '', alignment: 'center', style: this.prefix + 'tableHeaderStyle' }, 
                    { text: '', alignment: 'center', style: this.prefix + 'tableHeaderStyle' }
                ],                
                [
                    {
                        // image: this.imageLeft,
                        // width: 240
                    },
                    {
                        // image: this.imageMiddle,
                        // width: 240
                    },
                    {
                        // image: this.imageRight,
                        // width: 240
                    }
                ]
            ]
        },
        layout: 'noBorders',
        pageBreak: 'after'
    };

    private pdfContent: Array<any> = [];

    public getPdfContent(): Array<any> {

        let dashboardSectionList: Array<any> = [];
        let i: number;

        if(this.imageLeft && this.imageLeftUrl) {
            dashboardSectionList.push(
                {
                    header: "Frequency",
                    imageLink: this.prefix + this.imageLeft
                }
            );
        }
        if(this.imageMiddle && this.imageMiddleUrl) {
            dashboardSectionList.push(
                {
                    header: "Severity",
                    imageLink: this.prefix + this.imageMiddle
                }
            );
        }
        if(this.imageRight && this.imageRightUrl) {
            dashboardSectionList.push(
                {
                    header: "Benchmark",
                    imageLink: this.prefix + this.imageRight
                }
            );
        }
        for(i = 0; i < dashboardSectionList.length; i++) {
            this.table.table.body[0][i].text = dashboardSectionList[i].header;
            this.table.table.body[1][i] = {
                image: dashboardSectionList[i].imageLink,
                width: 240
            }
        }
        for(; i < 3; i++) {
            this.table.table.body[0][i].text = '';
            this.table.table.body[1][i] = {
                text: '',
                margin: [ 240, 0, 0, 0 ]
            };
        }

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

    public addChartLabel(index: number, chartName: string, chartDataUrl: string): number {
        if(index >= 0 && index <= 2) {
            chartName = chartName.replace(/\-/g,'_');
            let imageName = this.prefix + chartName;
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
        //all content added are on first page
        return 1;
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

        this.clearArray(this.pdfContent);
        this.pdfContent.push(this.header);
        this.pdfContent.push(this.table);
    }
};