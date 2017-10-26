import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as csrf from 'csurf';
import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';
import * as uuid from 'uuid';
import { EnvConfig } from '../env.config';
import { SecurityModel, ServerModel } from '../model/env.model';

export class Security{
    private securityModel: SecurityModel;
    private serverModel: ServerModel;
    private environment: string;

    constructor(private express: any){
        this.securityModel = EnvConfig.getSecurity();
        this.serverModel = EnvConfig.getServer();
        this.environment = EnvConfig.getEnvironment();
        this.init();
    }

    init(): void {
        if (this.environment.toLocaleLowerCase() !== 'DEV') {
          this.setupHeader();
        }
        this.setupServer();
    }


    private setupHeader(): void {
        this.express.use(cookieParser(this.securityModel.cookieParser));
        this.express.set('trust proxy');
        this.express.use(this.getCsurfProtection(this.securityModel.isCookie, this.securityModel.httpOnly, this.securityModel.secure, this.securityModel.sameSite, this.securityModel.ignoreMethods));
        this.express.use(this.manageToken);
        this.express.use(this.manageTransactionId);
    }

    //Set the csurf protection
    private getCsurfProtection(isCookie, httpOnly, secure, sameSite, ignoreMethods): any {
        return csrf({
            cookie: isCookie,
            httpOnly: httpOnly,
            secure: secure,
            sameSite: sameSite,
            ignoreMethods: ignoreMethods
        });
    }

    //Manage token for each request
    private manageToken(req, res, next){
        let csrfToken = req.csrfToken();
        res.cookie('XSRF-TOKEN', csrfToken);
        res.locals._csrf = csrfToken;

        let securityModel:SecurityModel = EnvConfig.getSecurity();
        for(let header of securityModel.headers){
            switch(header.type.toUpperCase()){
                case 'ADD':
                    res.header(header.name, header.value);
                break;

                case 'REMOVE':
                    res.removeHeader(header.value);
                break;

                default:break;
            }
        }
        next();
    }

    private manageTransactionId(req: express.Request, res, next){
        let allCookies =  Security.parseCookies(req.headers.cookie);
        if(allCookies && !allCookies.TransactionId){
            res.cookie('TransactionId', uuid.v4());
        }
        next();
    }

    private static parseCookies(cookie) {
            if(!cookie){
                return null;
            }
            return cookie.split(';').reduce(
                function(prev, curr) {
                    var m = / *([^=]+)=(.*)/.exec(curr);
                    var key = m[1];
                    var value = decodeURIComponent(m[2]);
                    prev[key] = value;
                    return prev;
                },{ });
    }

    private setupServer(): void {
        let isHttps: boolean = this.serverModel.useCertificate;
        let server: any;
        if(isHttps){
            server = https.createServer(this.getHttpsOptions, this.express).listen(this.serverModel.port);
        }
        else{
            server = http.createServer(this.express).listen(this.serverModel.port);
        }
        this.logServerDetails();
    }

    private getHttpsOptions(): any{
        return {
                cert: fs.readFileSync(this.serverModel.certPath),
                key: fs.readFileSync(this.serverModel.certKey),
                passphrase: this.serverModel.passPhrase
            };
    }

    private logServerDetails(): void{
        console.log(`Listening to ${this.serverModel.host}`)
        console.log(`Port - ${this.serverModel.port}`);
    }
}
