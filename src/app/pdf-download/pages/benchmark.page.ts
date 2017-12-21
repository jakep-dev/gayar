import { BasePage } from './base.page';
import { ComponentPrintSettings } from 'app/model/model';

export class BenchmarkPage extends BasePage  {

    public static pageType:string = 'BenchmarkPage';

    private prefix: string = BenchmarkPage.pageType + '_';

    public getPrefix() {
        return this.prefix;
    }

    public setPrefix(prefix: string) {
        this.prefix = prefix;
        this.updatePdfContent();
    }

    public getPageType(): string {
        return BenchmarkPage.pageType;
    }
    
    private headerStyle: any = {
        color: '#27a9bc',
        fontSize: 16,
        bold: true,
        margin: [60,0,40,0]
    };

    private header: any = {
        text: 'Benchmark',
        style: this.prefix + 'headerStyle'
    };

    private tableHeaderStyle: any = {
        color: '#b1d23b',
        fontSize: 14,
        bold: true
    };

    private imageList: Array<any> = [
        {
            header: '',
            imageName: ''
        }
    ];

    private tableRow1: any = {
        margin: [ 60, 20, 70, 0 ],
        table: {
            heights: [ 15, 400 ],
            body: [
                [
                    { text: '', alignment: 'left', style: this.prefix + 'tableHeaderStyle' },
                    { text: '', alignment: 'left', style: this.prefix + 'tableHeaderStyle' }
                ],                
                [
                    {
                        margin: [ -15, 0, 0, 0 ]
                    },
                    {
                        margin: [ -15, 0, 0, 0 ]
                    }
                ]
            ]
        },
        layout: 'noBorders',
        pageBreak: 'after'
    };

    private tableRow2: any = {
        margin: [ 60, 20, 70, 0 ],
        table: {
            heights: [ 15, 400 ],
            body: [
                [
                    { text: '', alignment: 'left', style: this.prefix + 'tableHeaderStyle' },
                    { text: '', alignment: 'left', style: this.prefix + 'tableHeaderStyle' }
                ],                
                [
                    {
                        margin: [ -15, 0, 0, 0 ]
                    },
                    {
                        margin: [ -10, 0, 0, 0 ]
                    }
                ]
            ]
        },
        layout: 'noBorders',
        pageBreak: 'after'
    };

    private tableRow3: any = {
        margin: [ 60, 20, 70, 0 ],
        table: {
            heights: [ 15, 400 ],
            body: [
                [
                    { text: '', alignment: 'left', style: this.prefix + 'tableHeaderStyle' },
                    { text: '', alignment: 'left', style: this.prefix + 'tableHeaderStyle' }
                ],                
                [
                    {
                        margin: [ -5, 0, 0, 0 ]
                    },
                    {
                        text: ''
                    }
                ]
            ]
        },
        layout: 'noBorders',
        pageBreak: 'after'
    };

    private headerTargetObjects: Array<any> = [
        this.tableRow1.table.body[0][0],
        this.tableRow1.table.body[0][1],
        this.tableRow2.table.body[0][0],
        this.tableRow2.table.body[0][1],
        this.tableRow3.table.body[0][0]
    ];

    private imageTargetObjects: Array<any> = [
        this.tableRow1.table.body[1][0],
        this.tableRow1.table.body[1][1],
        this.tableRow2.table.body[1][0],
        this.tableRow2.table.body[1][1],
        this.tableRow3.table.body[1][0]
    ];

    private chartList: Array<any> = [
        {
            chartTitle: 'Premium Distribution by Counts',
            imageName: '',
            imageData: ''
        },
        {
            chartTitle: 'Limit Distribution by Counts',
            imageName: '',
            imageData: ''
        },
        {
            chartTitle: 'Retention Distribution by Counts',
            imageName: '',
            imageData: ''
        },
        {
            chartTitle: 'Rate Per Million Distribution by Values',
            imageName: '',
            imageData: ''
        },
        {
            chartTitle: 'Limit Adequacy',
            imageName: '',
            imageData: ''
        }
    ];

    private pdfContent: Array<any> = [];

    public getPdfContent(): Array<any> {

        let i: number;
        let j: number;
        let imageCount: number = 0;
        for(i = 0; i < this.chartList.length; i++) {
            if(this.chartList[i].imageName && this.chartList[i].imageData) {
                this.headerTargetObjects[imageCount].text = this.chartList[i].chartTitle;
                this.imageTargetObjects[imageCount].image = this.prefix + this.chartList[i].imageName;
                this.imageTargetObjects[imageCount].width = 375;
                imageCount++;
            }
        }
        for(j = imageCount; j < this.headerTargetObjects.length; j++) {
            this.headerTargetObjects[j].text = '';
            this.imageTargetObjects[j].text = '';
        }

        this.clearArray(this.pdfContent);
        this.pdfContent.push(this.header);
        if(imageCount > 0) {

            this.pdfContent.push(this.tableRow1);
        }
        if(imageCount > 2) {

            this.pdfContent.push(this.tableRow2);
        }
        if(imageCount > 4) {
            this.pdfContent.push(this.tableRow3);
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
            width: 585,
            height: 400,
            drillDown: ''
        };
    }

    private getImageCount(): number {
        let i: number;
        let imageCount: number = 0;
        for(i = 0; i < this.chartList.length; i++) {
            if(this.chartList[i].imageName && this.chartList[i].imageData) {
                imageCount++;
            }
        }
        return imageCount;        
    }

    public addChartLabel(index: number, chartName: string, chartDataUrl: string): number {
        if(index >= 0 && index <= 4) {
            chartName = chartName.replace('-','_');
            let imageName = this.prefix + chartName;
            this.chartList[index].imageName = chartName;
            this.chartList[index].imageData = chartDataUrl;
            this.images[imageName] = chartDataUrl;
        }
        return this.getPageCount();
    }

    private updatePdfContent() {

        this.header.style = this.prefix + 'headerStyle';
        this.tableRow1.table.body[0][0].style = this.prefix + 'tableHeaderStyle';
        this.tableRow1.table.body[0][1].style = this.prefix + 'tableHeaderStyle';
        this.tableRow2.table.body[0][0].style = this.prefix + 'tableHeaderStyle';
        this.tableRow2.table.body[0][1].style = this.prefix + 'tableHeaderStyle';
        this.tableRow3.table.body[0][0].style = this.prefix + 'tableHeaderStyle';
        this.tableRow3.table.body[0][1].style = this.prefix + 'tableHeaderStyle';
        
        this.clearArray(this.styles);
        this.styles[this.prefix + 'headerStyle'] = this.headerStyle;
        this.styles[this.prefix + 'tableHeaderStyle'] = this.tableHeaderStyle;

        this.clearArray(this.images);

        let i: number;
        let imageCount: number = 0;
        for(i = 0; i < this.chartList.length; i++) {
            if(this.chartList[i].imageName && this.chartList[i].imageData) {
                this.images[this.prefix + this.chartList[i].imageName] = this.chartList[i].imageData;
                imageCount++;
            }
        }
    }

    public getPageCount() {
        let imageCount: number = this.getImageCount();

        if(imageCount > 4) {
            return 3;
        } else if(imageCount > 2) {
            return 2;
        } else {
            return 1;
        }
    }
};