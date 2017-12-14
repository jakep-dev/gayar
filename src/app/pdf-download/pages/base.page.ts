import { ComponentPrintSettings } from 'app/model/pdf.model';
import { IChartWidget } from 'app/model/report.model';

export abstract class BasePage {

    constructor() {
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

    public addChartLabel(index: number, chartName: string, chartDataUrl: string) {}

    public getPdfContent(): Array<any> {
        return [];
    }

    public getStyles(): Array<any> {
        return [];
    }

    public getImages(): Array<string> {
        return [];
    }
}