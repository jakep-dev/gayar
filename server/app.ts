import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as methodOverride from 'method-override';
import * as compress from 'compression';
import * as cors from 'cors';
import * as fs from 'fs';
import { SearchRouter, BenchmarkRouter, SessionRouter, DashboardRouter, FrequencyRouter, SeverityRouter, ApplicationRouter} from './routes/routes';
import { EnvConfig } from './env.config';
import { Security, Logger } from './helpers/helpers';
import { ServerModel, LogModel } from './model/env.model';

export class App {
    public expressApp: express.Application;
    public security: Security;
    private serverModel: ServerModel;
    private logModel: LogModel;
    
    constructor(){
        this.serverModel = EnvConfig.getServer();
        this.logModel = EnvConfig.getLog();
        this.expressApp = express();
        this.middleware();
        this.routes();
    }

    private middleware(): void {
        this.expressApp.use(favicon(path.join(__dirname, '..', `${this.serverModel.deploymentFolder}/favicon.ico`)));
        this.expressApp.use(compress())
        this.expressApp.use(morgan('combined', {stream: Logger.getStream()}))
        this.expressApp.use(cors());
        this.expressApp.use(bodyParser.json());
        this.expressApp.use(methodOverride())
        this.security = new Security(this.expressApp);
        this.expressApp.use(express.static(path.join(__dirname, `../${this.serverModel.deploymentFolder}`)));
        this.expressApp.use('/*', express.static(path.join(__dirname, `../${this.serverModel.deploymentFolder}/index.html`)));
    }
    
    private routes(): void {
        let searchRouter: SearchRouter       = new SearchRouter(this.expressApp),
            benchmarkRouter: BenchmarkRouter = new BenchmarkRouter(this.expressApp),
            sessionRouter: SessionRouter     = new SessionRouter(this.expressApp),
            frequencyRouter: FrequencyRouter   = new FrequencyRouter(this.expressApp),
            severityRouter: SeverityRouter   = new SeverityRouter(this.expressApp),
            dashboardRouter: DashboardRouter   = new DashboardRouter(this.expressApp),
            applicationRouter: ApplicationRouter   = new ApplicationRouter(this.expressApp);
            
    }
}
