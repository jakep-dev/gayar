import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as csrf from 'csurf';
import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';
import * as uuid from 'uuid';
import { EnvConfig } from '../env.config';
import { SecurityModel, ServerModel } from '../model/env.model';

export class Security{
    private static securityModel: SecurityModel;
    private static serverModel: ServerModel;
    private static environment: string;

    public static initialize() {
        Security.securityModel = EnvConfig.getSecurity();
        Security.serverModel = EnvConfig.getServer();
        Security.environment = EnvConfig.getEnvironment();
    }

    public static applySecurity(express: any) {
        Security.init(express);
    }

    private static init(express: any): void {
        if (Security.environment.toLocaleUpperCase() !== 'DEBUG') {
          Security.setupHeader(express);
        }
    }

    private static setupHeader(express: any): void {
        express.use(cookieParser(Security.securityModel.cookieParser));
        express.set('trust proxy');
        express.use(Security.getCsurfProtection(Security.securityModel.isCookie, Security.securityModel.httpOnly, Security.securityModel.secure, Security.securityModel.sameSite, Security.securityModel.ignoreMethods));
        express.use(Security.manageToken);
        express.use(Security.manageTransactionId);
    }

    //Set the csurf protection
    private static getCsurfProtection(isCookie, httpOnly, secure, sameSite, ignoreMethods): any {
        return csrf({
            cookie: isCookie,
            httpOnly: httpOnly,
            secure: secure,
            sameSite: sameSite,
            ignoreMethods: ignoreMethods
        });
    }

    //Manage token for each request
    private static manageToken(req, res, next){
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

    private static manageTransactionId(req: express.Request, res, next){
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

    public static setupServer(express: any): any {
        let isHttps: boolean = Security.serverModel.useCertificate;
        if(isHttps) {
            return https.createServer(Security.getHttpsOptions(), express).listen(Security.serverModel.port, Security.logServerDetails);
        }
        else {
            return http.createServer(express).listen(Security.serverModel.port, Security.logServerDetails);
        }
    }

    private static getHttpsOptions(): https.ServerOptions {
        return {
                cert: fs.readFileSync(Security.serverModel.certPath),
                key: fs.readFileSync(Security.serverModel.certKey),
                passphrase: Security.serverModel.passPhrase
            };
    }

    private static logServerDetails(): void{
        console.log(`Listening to ${Security.serverModel.host}`);
        console.log(`Port - ${Security.serverModel.port}`);
    }
};
