import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as methodOverride from 'method-override';
import * as compress from 'compression';
import * as cors from 'cors';
import { SearchRouter, BenchmarkRouter, SessionRouter, DashboardRouter, FrequencyRouter, SeverityRouter, ApplicationRouter} from './routes/routes';
import { EnvConfig } from './env.config';
import { Security, Logger } from './helpers/helpers';
import { ServerModel } from './model/env.model';

export class App {

    public expressApp: express.Application;

    private serverModel: ServerModel;
    private runningServer: any;

    constructor() {
        this.serverModel = EnvConfig.getServer();
        this.expressApp = express();
        this.middleware();
        this.routes();
    }

    public gracefulShutdown() {
        this.runningServer.close(
            function() {
                Logger.info('Closing out existing connections.');
                process.exit();
            }
        );
    }

    private middleware(): void {
        this.expressApp.use(favicon(path.join(__dirname, '..', `${this.serverModel.deploymentFolder}/favicon.ico`)));
        this.expressApp.use(compress());
        this.expressApp.use(morgan('":method :url HTTP/:http-version" :status :response-time ms :res[content-length] ":referrer" ":user-agent" :remote-addr :remote-user', {stream: Logger.getStream()}));
        this.expressApp.use(cors());
        this.expressApp.use(bodyParser.json());
        this.expressApp.use(methodOverride());
        Security.initialize();
        Security.applySecurity(this.expressApp);

        //returns either http.Server or https.Server
        this.runningServer = Security.setupServer(this.expressApp);
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
