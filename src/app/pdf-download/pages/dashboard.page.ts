import { IChartWidget } from 'app/model/report.model';
import { BasePage } from './base.page';
import { ComponentPrintSettings } from 'app/model/pdf.model';

export class DashboardPage extends BasePage  {

    chartList: Array<IChartWidget> = [];

    header = {
        text: 'Dashboard',
        style: 'sectionHearderStyle1'
    };

    table = {
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
    };
    constructor() {
        super();
    }

    getPrinteSettings(componentOrder: number) : ComponentPrintSettings {
        //all charts in this page type are the same size
        return {
            width: 347,
            height: 620
        };
    }

    addChartLabel(componentOrder: number, chart: IChartWidget) {
        if(componentOrder >= 0 && componentOrder <= 2) {
            this.table.table.body[0][componentOrder].image = chart.componentName;
        }
    }
};