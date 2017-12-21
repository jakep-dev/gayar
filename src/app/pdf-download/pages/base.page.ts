import { ComponentPrintSettings } from 'app/model/model';
import { IChartWidget } from 'app/model/report.model';

export abstract class BasePage {

    public static pageType:string = 'BasePage';

    constructor() {
    }

    public getPageType(): string {
        return BasePage.pageType;
    }
    
    public getPrefix(): string {
        return '';
    }

    public setPrefix(value: string) {}

    public getPrintSettings(componentOrder: number) : ComponentPrintSettings {
        return {
            width: 0,
            height: 0,
            drillDown: ''
        };
    }

    public addChartLabel(index: number, chartName: string, chartDataUrl: string): number { 
        return 1;
    }

    public getPdfContent(): Array<any> {
        return [];
    }

    public getStyles(): Array<any> {
        return [];
    }

    public getImages(): Array<string> {
        return [];
    }

    public clearArray(array: Array<any>) {
        array.length = 0;
        for(let item in array) {
            //console.log('Deleting key ' + item);
            delete array[item];
        }
    }

    public getPageCount(): number {
        return 1;
    }

}