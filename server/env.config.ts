import * as cookieParser from "cookie-parser";
import { EnvConfigModel, ServerModel, SecurityModel, ApiModel, LogModel } from './model/env.model';


export class EnvConfig {
    private static instance: EnvConfig;
    private static envConfigModel: EnvConfigModel = new EnvConfigModel();
    private static config:any;
    private static environment: string;

    private constructor(){}

    static getInstance(){
        if(!EnvConfig.instance){
            EnvConfig.instance = new EnvConfig();
        }
        return EnvConfig.instance;
    }

    init(env: string){
       EnvConfig.environment = env; 
       this.loadConfiguration();
       this.loadServerConfig();
       this.loadApiConfig();
       this.loadLogConfig();
       this.loadSecurityConfig();
    }

    static getLog(): LogModel {
        return EnvConfig.envConfigModel.Log;
    }

    static getSecurity(): SecurityModel {
        return EnvConfig.envConfigModel.Security;
    }

    static getServer(): ServerModel {
        return EnvConfig.envConfigModel.Server;
    }

    static getApi(): ApiModel {
        return EnvConfig.envConfigModel.Api;
    }
    
    static getSecurityHeader(): any {
        return EnvConfig.envConfigModel.Security.headers;
    }

    static getContractByName(name: string): string{
        return EnvConfig.envConfigModel.Api.endPoints.find(f=>f.name.toUpperCase() === name.toUpperCase()).contract;
    }


    //Load the corresponding environment file
    private loadConfiguration(): void{
        switch(EnvConfig.environment.toUpperCase()){
            case 'DEV':
                EnvConfig.config = require("./config/app.dev.config.json");
            break;

            case 'INT':
                EnvConfig.config = require("./config/app.int.config.json");
            break;

            case 'PROD':
                EnvConfig.config = require("./config/app.prod.config.json");
            break;

            default:
                EnvConfig.config = require("./config/app.dev.config.json");
            break;
        }
    }

    private loadApiConfig(): void{
        EnvConfig.envConfigModel.Api.host        = EnvConfig.config.api.host;
        EnvConfig.envConfigModel.Api.port        = EnvConfig.config.api.port;
        EnvConfig.envConfigModel.Api.protocol    = EnvConfig.config.api.protocol;
        EnvConfig.envConfigModel.Api.endPoints   = EnvConfig.config.api.endPoints;
    }

    private loadLogConfig(): void{
        EnvConfig.envConfigModel.Log.level                = EnvConfig.config.log.level;
        EnvConfig.envConfigModel.Log.dirName              = EnvConfig.config.log.dirName;
        EnvConfig.envConfigModel.Log.filePath             = EnvConfig.config.log.filePath;
        EnvConfig.envConfigModel.Log.datePattern          = EnvConfig.config.log.datePattern;
        EnvConfig.envConfigModel.Log.prepend              = EnvConfig.config.log.prepend;
        EnvConfig.envConfigModel.Log.handleExceptions      = EnvConfig.config.log.handleExceptions;
        EnvConfig.envConfigModel.Log.humanReadableUnhandledException = EnvConfig.config.log.humanReadableUnhandledException;
        EnvConfig.envConfigModel.Log.json                 = EnvConfig.config.log.json;
        EnvConfig.envConfigModel.Log.colorize             = EnvConfig.config.log.colorize;
        EnvConfig.envConfigModel.Log.prettyPrint          = EnvConfig.config.log.prettyPrint;
        EnvConfig.envConfigModel.Log.timeStamp            = new Date().toISOString();
        EnvConfig.envConfigModel.Log.maxSize              = EnvConfig.config.log.maxSize;
        EnvConfig.envConfigModel.Log.maxFiles             = EnvConfig.config.log.maxFiles;
        EnvConfig.envConfigModel.Log.exceptionFilePath    = EnvConfig.config.log.exceptionFilePath;
    }

    private loadSecurityConfig(): void {
        EnvConfig.envConfigModel.Security.isCookie        = EnvConfig.config.security.isCookie;
        EnvConfig.envConfigModel.Security.httpOnly        = EnvConfig.config.security.httpOnly;
        EnvConfig.envConfigModel.Security.secure          = EnvConfig.config.security.secure;
        EnvConfig.envConfigModel.Security.sameSite        = EnvConfig.config.security.sameSite;
        EnvConfig.envConfigModel.Security.ignoreMethods   = EnvConfig.config.security.ignoreMethods;
        EnvConfig.envConfigModel.Security.cookieParser    = EnvConfig.config.security.cookieParser;
        EnvConfig.envConfigModel.Security.headers         = EnvConfig.config.security.headers;
    }

    private loadServerConfig(): void {
        EnvConfig.envConfigModel.Server.protocol          = EnvConfig.config.server.protocol;
        EnvConfig.envConfigModel.Server.host              = EnvConfig.config.server.host;
        EnvConfig.envConfigModel.Server.port              = EnvConfig.config.server.port;
        EnvConfig.envConfigModel.Server.useCertificate    = EnvConfig.config.server.useCertificate;
        EnvConfig.envConfigModel.Server.certKey           = EnvConfig.config.server.certKey;
        EnvConfig.envConfigModel.Server.certPath          = EnvConfig.config.server.certPath;
        EnvConfig.envConfigModel.Server.passPhrase        = EnvConfig.config.server.passPhrase;
        EnvConfig.envConfigModel.Server.deploymentFolder  = EnvConfig.config.server.deploymentFolder;

    }
}
