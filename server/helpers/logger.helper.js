"use strict";
exports.__esModule = true;
var winston = require("winston");
require('winston-daily-rotate-file');
var env_config_1 = require("../env.config");
var Logger = (function () {
    function Logger() {
    }
    Logger.getInstance = function () {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    };
    Logger.prototype.init = function (env) {
        this.env = env;
        this.logModel = env_config_1.EnvConfig.getLog();
        this.handleLogger();
    };
    Logger.prototype.unHandleException = function () {
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
    };
    Logger.prototype.handleException = function () {
        winston.handleExceptions(new (winston.transports.DailyRotateFile)({
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
    };
    Logger.prototype.handleLogger = function () {
        Logger.logger = new winston.Logger({
            transports: [
                new (winston.transports.Console)(),
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
    };
    Logger.getStream = function () {
        if (!Logger.logger) {
            return null;
        }
        return {
            write: function (message, encoding) {
                Logger.logger.info(message);
            }
        };
    };
    Logger.debug = function (msg) {
        Logger.logger.debug(msg);
    };
    Logger.error = function (msg) {
        Logger.logger.error(msg);
    };
    Logger.warn = function (msg) {
        Logger.logger.warn(msg);
    };
    Logger.info = function (msg) {
        Logger.logger.info(msg);
    };
    return Logger;
}());
exports.Logger = Logger;
