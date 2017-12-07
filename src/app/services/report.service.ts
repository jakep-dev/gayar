import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { IReportTileModel } from 'app/model/model';

@Injectable()
export class ReportService {
    constructor() {  }

    getReportConfig () : Observable<Array<IReportTileModel>> {
        let subject = new Subject<Array<IReportTileModel>>();
        try {
            setTimeout(() => {
                subject.next(REPORT_CONFIGURATION);
                subject.complete();
            }, 0);
        }
        catch (e) {
        }
        return subject;
    }
}

const REPORT_CONFIGURATION: Array<IReportTileModel> = [
    {
        id: 'REPORT_TILE_DASHBOARD',
        description: 'Dashboard',
        value: true,
        subComponents: [
            {
                description: 'Frequency',
                id: 'REPORT_DASHBOARD_FREQUENCY',
                value: true,
                pageType: 'DashboardPage',
                chartComponents: [
                    {
                        componentName: 'app-dashboard-frequency',
                        pagePosition: 0,
                        drillDownName: '',
                        viewName: ''
                    }
                ],
                subSubComponents: null
            },
            {
                description: 'Severity',
                id: 'REPORT_DASHBOARD_SEVERITY',
                value: true,
                pageType: 'DashboardPage',
                chartComponents: [
                    {
                        componentName: 'app-dashboard-severity',
                        pagePosition: 1,
                        drillDownName: '',
                        viewName: ''
                    }
                ],
                subSubComponents: null
            },
            {
                description: 'Benchmark',
                id: 'REPORT_DASHBOARD_BENCHMARK',
                value: true,
                pageType: 'DashboardPage',
                chartComponents: [
                    {
                        componentName: 'dashboard-benchmark-score',
                        pagePosition: 2,
                        drillDownName: '',
                        viewName: ''
                    }
                ],
                subSubComponents: null
            }
        ]
    }
];
