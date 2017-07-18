"use strict";
exports.__esModule = true;
var env_model_1 = require("./model/env.model");
var EnvConfig = (function () {
    function EnvConfig() {
    }
    EnvConfig.getInstance = function () {
        if (!EnvConfig.instance) {
            EnvConfig.instance = new EnvConfig();
        }
        return EnvConfig.instance;
    };
    EnvConfig.prototype.init = function (env) {
        EnvConfig.environment = env;
        this.loadConfiguration();
        this.loadServerConfig();
        this.loadApiConfig();
        this.loadLogConfig();
        this.loadSecurityConfig();
    };
    EnvConfig.getLog = function () {
        return EnvConfig.envConfigModel.Log;
    };
    EnvConfig.getSecurity = function () {
        return EnvConfig.envConfigModel.Security;
    };
    EnvConfig.getServer = function () {
        return EnvConfig.envConfigModel.Server;
    };
    EnvConfig.getApi = function () {
        return EnvConfig.envConfigModel.Api;
    };
    EnvConfig.getSecurityHeader = function () {
        return EnvConfig.envConfigModel.Security.headers;
    };
    EnvConfig.getContractByName = function (name) {
        return EnvConfig.envConfigModel.Api.endPoints.find(function (f) { return f.name.toUpperCase() === name.toUpperCase(); }).contract;
    };
    //Load the corresponding environment file
    EnvConfig.prototype.loadConfiguration = function () {
        switch (EnvConfig.environment.toUpperCase()) {
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
    };
    EnvConfig.prototype.loadApiConfig = function () {
        EnvConfig.envConfigModel.Api.host = EnvConfig.config.api.host;
        EnvConfig.envConfigModel.Api.port = EnvConfig.config.api.port;
        EnvConfig.envConfigModel.Api.protocol = EnvConfig.config.api.protocol;
        EnvConfig.envConfigModel.Api.endPoints = EnvConfig.config.api.endPoints;
    };
    EnvConfig.prototype.loadLogConfig = function () {
        EnvConfig.envConfigModel.Log.level = EnvConfig.config.log.level;
        EnvConfig.envConfigModel.Log.dirName = EnvConfig.config.log.dirName;
        EnvConfig.envConfigModel.Log.filePath = EnvConfig.config.log.filePath;
        EnvConfig.envConfigModel.Log.datePattern = EnvConfig.config.log.datePattern;
        EnvConfig.envConfigModel.Log.prepend = EnvConfig.config.log.prepend;
        EnvConfig.envConfigModel.Log.handleExceptions = EnvConfig.config.log.handleExceptions;
        EnvConfig.envConfigModel.Log.humanReadableUnhandledException = EnvConfig.config.log.humanReadableUnhandledException;
        EnvConfig.envConfigModel.Log.json = EnvConfig.config.log.json;
        EnvConfig.envConfigModel.Log.colorize = EnvConfig.config.log.colorize;
        EnvConfig.envConfigModel.Log.prettyPrint = EnvConfig.config.log.prettyPrint;
        EnvConfig.envConfigModel.Log.timeStamp = new Date().toISOString();
        EnvConfig.envConfigModel.Log.maxSize = EnvConfig.config.log.maxSize;
        EnvConfig.envConfigModel.Log.maxFiles = EnvConfig.config.log.maxFiles;
        EnvConfig.envConfigModel.Log.exceptionFilePath = EnvConfig.config.log.exceptionFilePath;
    };
    EnvConfig.prototype.loadSecurityConfig = function () {
        EnvConfig.envConfigModel.Security.isCookie = EnvConfig.config.security.isCookie;
        EnvConfig.envConfigModel.Security.httpOnly = EnvConfig.config.security.httpOnly;
        EnvConfig.envConfigModel.Security.secure = EnvConfig.config.security.secure;
        EnvConfig.envConfigModel.Security.sameSite = EnvConfig.config.security.sameSite;
        EnvConfig.envConfigModel.Security.ignoreMethods = EnvConfig.config.security.ignoreMethods;
        EnvConfig.envConfigModel.Security.cookieParser = EnvConfig.config.security.cookieParser;
        EnvConfig.envConfigModel.Security.headers = EnvConfig.config.security.headers;
    };
    EnvConfig.prototype.loadServerConfig = function () {
        EnvConfig.envConfigModel.Server.protocol = EnvConfig.config.server.protocol;
        EnvConfig.envConfigModel.Server.host = EnvConfig.config.server.host;
        EnvConfig.envConfigModel.Server.port = EnvConfig.config.server.port;
        EnvConfig.envConfigModel.Server.useCertificate = EnvConfig.config.server.useCertificate;
        EnvConfig.envConfigModel.Server.certKey = EnvConfig.config.server.certKey;
        EnvConfig.envConfigModel.Server.certPath = EnvConfig.config.server.certPath;
        EnvConfig.envConfigModel.Server.passPhrase = EnvConfig.config.server.passPhrase;
        EnvConfig.envConfigModel.Server.deploymentFolder = EnvConfig.config.server.deploymentFolder;
    };
    return EnvConfig;
}());
EnvConfig.envConfigModel = new env_model_1.EnvConfigModel();
exports.EnvConfig = EnvConfig;
