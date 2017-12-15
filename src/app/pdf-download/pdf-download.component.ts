import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef, ElementRef, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FADE_ANIMATION} from 'app/shared/animations/animations';
import { SearchService, MenuService, FontService, GetFileService } from 'app/services/services';
import { DashboardScore, ComponentPrintSettings } from 'app/model/model';
import { BaseChart } from 'app/shared/charts/base-chart';
import { FrequencyComponent } from 'app/dashboard/frequency/frequency.component';
import { canvasFactory } from 'app/shared/pdf/pdfExport';
import { getPdfMake } from 'app/shared/pdf/pdfExport';

@Component({
    selector: 'pdf-download',
    templateUrl: 'pdf-download.component.html',
    styleUrls: ['./pdf-download.component.scss'],
    entryComponents: [FrequencyComponent],
    animations: [FADE_ANIMATION],
    host: { '[@routerTransition]': '' }
})
export class PdfDownloadComponent implements OnInit {

    private pdfMake: any;

    public searchType: string;
    public companyId: number;
    public naics: string;
    public revenueRange: string;

    public getDashboardScoreByManualInput: DashboardScore;

    public printSettings: ComponentPrintSettings;

    private chart: BaseChart;

    @ViewChild('entryPoint', { read: ViewContainerRef }) entryPoint: ViewContainerRef;

    @ViewChild('canvas') canvas: ElementRef;

    //@ViewChild('img') img: ElementRef;

    companyNameTextObject = {
        text: '<Company Name>',
        style: 'coverPageStyle3',
        border: [false, false, false, false]
    };

    industryTextObject = {
        text: '<Industry>',
        style: 'coverPageStyle4',
        border: [false, false, false, false]
    };

    revenueRangeTextObject = {
        text: '<Revenue Range>',
        style: 'coverPageStyle4',
        border: [false, false, false, false]
    };

    userCompanyTextObject =  {
        text: '<Company Name of the user>',
    };

    dateGeneratedTextObject = {
        text: '<Date Generated>',
        style: 'coverPageStyle5',
        border: [false, false, false, false]
    };

    pdfContent = {
        pageOrientation: 'landscape',
        pageMargins: [ 8, 45, 8, 45 ],
        content: [
            {
                style: 'coverPageTable1',
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
                                style: 'coverPageStyle1',
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
                                style: 'coverPageStyle2',
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
                                style: 'coverPageStyle5',
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
                style: 'coverPageTable2',
                table: {
                    widths: ['*'],
                    body: [
                        [
                            {
                                image: 'logo',
                                border: [false, false, false, false]
                            }
                        ]
                    ]
                }
            },
            {
                style: 'coverPageTable1',
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
            },
            {
                text: [
                    {
                        text: "TABLE",
                        style: "TOCStyle1"
                    },
                    {
                        text: " of ",
                        style: "TOCStyle2"
                    },
                    {
                        text: "CONTENTS",
                        style: "TOCStyle1"
                    }
                ],
                margin: [64,0,0,0]
            },
            {
                margin: [64, 5, 70, 10],
                table: {
                    widths: ['94%', '6%'],
                    body: [
                        [
                            {
                                text: 'Chart ..........................................................................................................................................................................................................................................................................',
                                noWrap: false,
                                maxHeight: 20
                            }, 
                            '8888'
                        ],
                    ]
                },
                pageBreak: 'after'
            },
            {
                text: 'Dashboard',
                style: 'sectionHearderStyle1'
            },
            {
                margin: [64, 20, 70, 0],
                table: {
                    widths: ['33.33%', '33.33%', '33.33%'],
                    body: [
                        [
                            {
                                image: 'frequencyGaugeComponent'
                            },
                            {
                                image: 'frequencyGaugeComponent'
                            },
                            {
                                image: 'frequencyGaugeComponent'
                            }
                        ],
                    ]
                },
                pageBreak: 'after'
            },            
            'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines',        
            {
                image: 'frequencyGaugeComponent'
            }
        ],
        defaultStyle: {
            font: 'CenturyGothic'
        },
        styles: {
            coverPageTable1: {
                fillColor: '#464646',
                margin: [0,-3,0,0],
                alignment: 'center'
            },
            coverPageStyle1: {
                color: 'white',
                fontSize: 28,
                bold: true
            },
            coverPageStyle2: {
                color: '#b1d23b',
                fontSize: 28,
                italics: true
            },
            coverPageStyle3: {
                color: 'white',
                fontSize: 28
            },
            coverPageStyle4: {
                color: 'white',
                fontSize: 20
            },
            coverPageStyle5: {
                color: 'white',
                fontSize: 14
            },
            coverPageTable2: {
                fillColor: 'white',
                alignment: 'right'
            },
            sectionHearderStyle1: {
                color: '#27a9bc',
                fontSize: 16,
                margin: [64,0,40,0]
            },
            sectionHearderStyle2: {
                color: '#b1d23b',
                fontSize: 14
            },
            sectionHearderStyle3: {
                color: '#464646',
                fontSize: 12
            },
            headerTable1: {
                fillColor: '#464646',
                alignment: 'center',
                margin: [8,7,8,0]
            },
            footerTable1: {
                fillColor: '#464646',
                alignment: 'center',
                margin: [8,-12,8,0]
            },
            footerTable2: {
                fontSize: 8,
                color: '#7f7f7f',
                margin: [64,0,70,0]
            },
            TOCStyle1: {
                color: '#7a9bc',
                fontSize: 22,
                bold: true
            },
            TOCStyle2: {
                color: '#b1d23b',
                fontSize: 22,
                bold: true,
                italics: true
            }
        },
        images: {
            frequencyGaugeComponent: '',
            logo: ''
        },
        header: this.header,
        footer: this.footer
    };

    private header(currentPage: number, pageCount: number): any {
	    if(currentPage == 1) {
            return {
                style: 'headerTable1',
                table: {
                    widths: ['*'],
                    body: [
                        [
                            {
                                text: '\n\n',
                                border: [false, false, false, false]
                            }
                        ]
                    ]
                },                
            };
	    } else {
	        return {
                text: 'Cyber OverVue Report',
                alignment: 'right',
                fontSize: 11,
                color: '#7f7f7f',
                margin: [70,25,70,0]
            };
	    }
    }

    private footer(currentPage: number, pageCount: number): any {
	    if(currentPage == 1) {
            return {
                style: 'footerTable1',
                table: {
                    widths: ['*'],
                    body: [
                        [
                            {
                                text: '\n\n\n',
                                border: [false, false, false, false]
                            }
                        ]
                    ]
                }
            };
	    } else {
	        return {
                style: 'footerTable2',
                table: {
                    widths: ['*','10'],
                    body: [
                        [
                            {
                                text: 'For a detailed explanation of terms and analytics, please see the Appendix at the end of this report',
                                alignment: 'center',
                                border: [false, true, false, false]
                            },
                            {
                                text: currentPage,
                                alignment: 'right',
                                border: [false, false, false, false]
                            }
                        ]
                    ]
                }
            };
	    }
    }

    constructor(private fontService: FontService,
        private getFileService: GetFileService,
        private rootElement: ElementRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private searchService: SearchService, 
        private menuService: MenuService) {

        this.menuService.breadCrumb = 'Reports';
        this.naics = (this.searchService.searchCriteria.industry && this.searchService.searchCriteria.industry.naicsDescription)? this.searchService.searchCriteria.industry.naicsDescription: null;
        this.revenueRange = (this.searchService.searchCriteria.revenue && this.searchService.searchCriteria.revenue.rangeDisplay)? this.searchService.searchCriteria.revenue.rangeDisplay : null; 

        this.companyNameTextObject.text = (this.searchService.selectedCompany && this.searchService.selectedCompany.companyName) ? this.searchService.selectedCompany.companyName : this.searchService.searchCriteria.value;
        if(this.naics) {
            this.industryTextObject.text = this.naics;
        }
        if(this.revenueRange) {
            this.revenueRangeTextObject.text = this.revenueRange;
        }
        this.userCompanyTextObject.text = 'Advisen';
        
        this.getFileService.getAsDataUrl('/assets/images/advisen-logo.png');
        this.getFileService.fileData$.subscribe(this.updateAdvisenLogo.bind(this));

        if(this.fontService.isLoadComplete()) {
            this.pdfMake = getPdfMake(this.fontService.getFontFiles(), this.fontService.getFontNames());
        } else {
            this.fontService.loadCompleted$.subscribe(this.configurePDFMake.bind(this));
        }
    }

    private updateAdvisenLogo(dataUrl: string) {
        this.pdfContent.images.logo = dataUrl;
    }

    /**
     * create benchmark score chart input
     */
    setupDashboardScoreInput() {
        this.searchType = this.searchService.searchCriteria.type;
        if (this.searchType !== 'SEARCH_BY_MANUAL_INPUT') {
            this.companyId = this.searchService.selectedCompany.companyId;
        } else {
            this.companyId = null;
        }

        this.getDashboardScoreByManualInput = {
            searchType: this.searchType,
            chartType: 'BENCHMARK',
            companyId: this.companyId,
            naics: this.naics,
            revenueRange: this.revenueRange,
            limit : this.searchService.searchCriteria.limit,
            retention: this.searchService.searchCriteria.retention,
        };
    }

    setWorkingChart(chart: BaseChart) {
        this.chart = chart;
    }

    startImageConversion(start: boolean) {
        if(start && this.chart != null) {
            setTimeout(this.loadCurrentChartImage.bind(this), 500);
        }
    }

    loadCurrentChartImage() {

        let childImages = this.rootElement.nativeElement.getElementsByTagName('svg');
        if(childImages.length > 0) {
            //First child is th SVG image, calling chart.getSVG changes the underlying svg
            let svgElement = childImages[0];
            //IE doesn't support outerHTML for svg tag
            let data = svgElement.parentNode.innerHTML;
            //Filter out all child nodes except for the svg tag
            let indexPosition = data.indexOf('</svg>');
            if(indexPosition < 0) {
                indexPosition = data.indexOf('</SVG>');
            }
            if(indexPosition > 0) {
                //console.log("fragment = " + data.substr(indexPosition, 6));
                data = data.substr(0, indexPosition + 6);
            }
            //don't add attribute to svgElement via setAttribute, in IE it mangles the namespace
            //Firefox requires a specific xlink for external images
            data = data.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink" ');

            canvasFactory(this.canvas.nativeElement, data,  
                { 
                    ignoreMouse: true, 
                    ignoreAnimation: true, 
                    useCORS: true,
                    renderCallback: this.renderCompleteCallback.bind(this)
                }
            );
        }
    }

    renderCompleteCallback() {
        let buffer = this.canvas.nativeElement.toDataURL('image/png');
        this.canvas.nativeElement.getContext('2d').clearRect(0, 0, this.printSettings.width, this.printSettings.height);
        this.entryPoint.clear();
        //this.img.nativeElement.src = buffer;
        //console.log(buffer);
        //console.log(this.pdfMake);

        console.log('image size = ' + buffer.length);

        this.pdfContent.images.frequencyGaugeComponent = buffer;
        let  dp = new DatePipe('en-US');
        this.dateGeneratedTextObject.text = dp.transform(new Date(), 'MMMM d, yyyy');
        this.pdfMake.createPdf(this.pdfContent).download('test.pdf');
    }

    private configurePDFMake(isReady: boolean) {
        if(isReady) {
            this.pdfMake = getPdfMake(this.fontService.getFontFiles(), this.fontService.getFontNames());
        }
    }

    ngOnInit() {
        this.setupDashboardScoreInput();

        this.printSettings = {
            width: 600,
            height: 400,
            drillDown: ''
        };

        this.canvas.nativeElement.width = this.printSettings.width;
        this.canvas.nativeElement.height = this.printSettings.height;
  
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(FrequencyComponent);
        this.entryPoint.clear();
        const frequencyGaugeComponent = <FrequencyComponent>this.entryPoint.createComponent(componentFactory).instance;
        frequencyGaugeComponent.componentData = this.getDashboardScoreByManualInput;
        frequencyGaugeComponent.printSettings = this.printSettings;
        frequencyGaugeComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
        frequencyGaugeComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
    }

}
