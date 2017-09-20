import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { FrequencyDataResponseModel } from 'app/model/model';

@Injectable()
export class FrequencyService extends BaseService {
    constructor(http: Http) {
        super(http);
    }

    public getFrequencyDataTable(token: string, companyId: number, industry: string, revenue: string): Observable<FrequencyDataResponseModel> {
        try {
            return super.Post<FrequencyDataResponseModel>('/api/getFrequencyData', {
                'token': token,
                'company_id': companyId,
                'industry': industry,
                'revenue_range': revenue
            });
        }
        catch (e) {
        }
    }
}
