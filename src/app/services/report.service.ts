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
        setTimeout(()=>{
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
    value: false,
    subComponents: [{
      id: 'Benchmark_Gauge',
      description: 'Benchmark Gauge',
      value: false
    },
    {
      id: 'Frequency_Gauge',
      description: 'Frequency Gauge',
      value: false
    },
    {
      id: 'Severity_Gauge',
      description: 'Severity Gauge',
      value: false
    }]
  },
  {
    id: 'REPORT_TILE_BENCHMARK',
    description: 'Benchmark',
    value: false,
    subComponents: []
  },
  {
    id: 'REPORT_TILE_FREQUENCY',
    description: 'Frequency',
    value: false,
    subComponents: []
  }
];
