import { Request, Response, NextFunction, Application } from 'express';
import { BaseRoute } from './base-route';
import { Logger } from '../helpers/helpers';

export class ApplicationRouter extends BaseRoute {

    constructor(private app: Application) {
        super();
        this.init();
    }

    public getGlossary(req: Request, res: Response, next: NextFunction) {
        try {
            super.PerformGetRequest("getGlossary", {
                'ssnid': req.header('authorization'),
            }, (data) => {
                res.send(data);
            });
        }
        catch (e) {
            Logger.error(e);
        }
    }

    //Initialize all the api call endpoints
    init() {
        this.app.post('/api/getGlossary', this.getGlossary);
    }
}