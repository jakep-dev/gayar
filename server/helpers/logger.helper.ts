import * as winston from 'winston';
require('winston-daily-rotate-file');
import { EnvConfig } from '../env.config';
import { LogModel } from '../model/env.model';

export class Logger {
    private static instance: Logger;
    
    private static logger: winston.LoggerInstance;
    
    private logModel: LogModel;
    
    private env: string;
    
    private workerId: number;

    static getInstance(): Logger {
        if(!Logger.instance){
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    private getTimestamp() {
        return (new Date()).toISOString();
    }

    private logFormatter(options) {
        if (options.message) {
            //strip out extra \n from morgan log messages
            if (options.message[options.message.length - 1] == '\n') {
                options.message = options.message.replace(/\n$/, '');
            }
        } else {
            //if the message is blank, null or undefined and not a stack trace from an exception then message is most likely a JSON object.
            //attempt to stringify the object
            if (!options.meta || !options.meta.stack) {
                try {
                    options.message = JSON.stringify(options.meta);
                } catch (exception) {}
            }
        }

        //options.timestamp() +' ['+ options.level.toUpperCase() +'] '+ (undefined !== options.message ? options.message : '') + (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
        return options.timestamp() +' ['+ options.level.toUpperCase() +']['+ Logger.instance.workerId +'] '+ (undefined !== options.message ? options.message : '') + (options.meta && options.meta.stack ? '\n' + options.meta.stack : '' );
    }

    private constructor(){}

    init(env: string, workerId: number) {
        this.workerId = workerId;
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
                    prettyPrint: this.logModel.prettyPrint,
                    timestamp: this.getTimestamp,
                    formatter: this.logFormatter
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
                    prettyPrint: this.logModel.prettyPrint,
                    timestamp: this.getTimestamp,
                    formatter: this.logFormatter
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
                    prettyPrint: this.logModel.prettyPrint,
                    timestamp: this.getTimestamp,
                    formatter: this.logFormatter
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
                    prettyPrint: this.logModel.prettyPrint,
                    timestamp: this.getTimestamp,
                    formatter: this.logFormatter
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