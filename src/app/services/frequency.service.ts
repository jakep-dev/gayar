import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FrequencyService extends BaseService {
    constructor(http: Http) {
        super(http);
    }
}
