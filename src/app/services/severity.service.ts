import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SeverityDataResponseModel } from 'app/model/model';


@Injectable()
export class SeverityService extends BaseService {
    constructor(http: Http) {
        super(http);
    }

    public getSeverityDataTable(companyId: number, industry: string, revenueRange: string): Observable<SeverityDataResponseModel> {
        try {
            return super.Post<SeverityDataResponseModel>('/api/getSeverityData', {
                'company_id': companyId,
                'industry': industry,
                'revenue_range': revenueRange
            });
        }
        catch (e) {
        }
    }    
}
