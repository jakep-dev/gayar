import { ComponentPrintSettings } from 'app/model/pdf.model';
import { IChartWidget } from 'app/model/report.model';

export abstract class BasePage {

    constructor() {
    }

    getPrinteSettings(componentOrder: number) : ComponentPrintSettings {
        return {
            width: 0,
            height: 0
        };
    }

    addChartLabel(index: number, chart: IChartWidget) {}

}