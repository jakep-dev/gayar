import * as winston from 'winston';
require('winston-daily-rotate-file');
import { EnvConfig } from '../env.config';
import { LogModel } from '../model/env.model';
import { Response } from 'express';


export class Logger {
    private static instance: Logger;
    private static logger: winston.LoggerInstance;
    
    private logModel: LogModel;
    private env: string;

    static getInstance(): Logger {
        if(!Logger.instance){
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    private constructor(){}

    init(env: string){
         this.env = env;
         this.logModel = EnvConfig.getLog();
         this.handleLogger();
    }
    
    private unHandleException(): void {
        winston.unhandleExceptions(new (winston.transports.DailyRotateFile)({ 
                    level: this.logModel.level,
                    dirname: this.logModel.dirName,
                    filename: this.logModel.filePath,
                    datePattern: this.logModel.datePattern,
                    prepend: this.logModel.prepend,
                    handleExceptions: this.logModel.handleExceptions,
                    humanReadableUnhandledException: this.logModel.humanReadableUnhandledException,
                    json: this.logModel.json,
                    maxsize: this.logModel.maxSize,
                    maxFiles: this.logModel.maxFiles,
                    colorize: this.logModel.colorize,
                    prettyPrint: this.logModel.prettyPrint
                 }));
    }

    private handleException(): void{
        winston.handleExceptions(
            new (winston.transports.DailyRotateFile)({ 
                    level: this.logModel.level,
                    dirname: this.logModel.dirName,
                    filename: this.logModel.filePath,
                    datePattern: this.logModel.datePattern,
                    prepend: this.logModel.prepend,
                    handleExceptions: this.logModel.handleExceptions,
                    humanReadableUnhandledException: this.logModel.humanReadableUnhandledException,
                    json: this.logModel.json,
                    maxsize: this.logModel.maxSize,
                    maxFiles: this.logModel.maxFiles,
                    colorize: this.logModel.colorize,
                    prettyPrint: this.logModel.prettyPrint
                 })); 
    }

    private handleLogger(){
        Logger.logger = new winston.Logger({
            transports: [
                // new (winston.transports.Console)(),
                new (winston.transports.DailyRotateFile)({ 
                    level: this.logModel.level,
                    dirname: this.logModel.dirName,
                    filename: this.logModel.filePath,
                    datePattern: this.logModel.datePattern,
                    prepend: this.logModel.prepend,
                    handleExceptions: this.logModel.handleExceptions,
                    humanReadableUnhandledException: this.logModel.humanReadableUnhandledException,
                    json: this.logModel.json,
                    maxsize: this.logModel.maxSize,
                    maxFiles: this.logModel.maxFiles,
                    colorize: this.logModel.colorize,
                    prettyPrint: this.logModel.prettyPrint
                 })
            ],
            exceptionHandlers: [
                new (winston.transports.DailyRotateFile)({ 
                    level: this.logModel.level,
                    dirname: this.logModel.dirName,
                    filename: this.logModel.filePath,
                    datePattern: this.logModel.datePattern,
                    prepend: this.logModel.prepend,
                    handleExceptions: this.logModel.handleExceptions,
                    humanReadableUnhandledException: this.logModel.humanReadableUnhandledException,
                    json: this.logModel.json,
                    maxsize: this.logModel.maxSize,
                    maxFiles: this.logModel.maxFiles,
                    colorize: this.logModel.colorize,
                    prettyPrint: this.logModel.prettyPrint
                 })
            ],
            handleExceptions: true,

            exitOnError: false
        });
    }

    static getStream() : any{
        if (!Logger.logger) {
            return null;
        }

        return {
                write: function (message, encoding) {
                  Logger.logger.info(message);
                }
        };
    }

    static debug(msg: string){
        Logger.logger.debug(msg);
    }

    static error(msg: string){
        Logger.logger.error(msg);
    }

    static warn(msg: string){
        Logger.logger.warn(msg);
    }

    static info(msg: string){
        Logger.logger.info(msg);
    }
}