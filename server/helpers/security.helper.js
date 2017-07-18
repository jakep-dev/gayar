"use strict";
exports.__esModule = true;
var cookieParser = require("cookie-parser");
var csrf = require("csurf");
var https = require("https");
var http = require("http");
var fs = require("fs");
var uuid = require("uuid");
var env_config_1 = require("../env.config");
var Security = (function () {
    function Security(express) {
        this.express = express;
        this.securityModel = env_config_1.EnvConfig.getSecurity();
        this.serverModel = env_config_1.EnvConfig.getServer();
        this.init();
    }
    Security.prototype.init = function () {
        //this.setupHeader();
        this.setupServer();
    };
    Security.prototype.setupHeader = function () {
        this.express.use(cookieParser(this.securityModel.cookieParser));
        this.express.use(this.getCsurfProtection(this.securityModel.isCookie, this.securityModel.httpOnly, this.securityModel.secure, this.securityModel.sameSite, this.securityModel.ignoreMethods));
        this.express.use(this.manageToken);
        this.express.use(this.manageTransactionId);
    };
    //Set the csurf protection
    Security.prototype.getCsurfProtection = function (isCookie, httpOnly, secure, sameSite, ignoreMethods) {
        return csrf({
            cookie: isCookie,
            httpOnly: httpOnly,
            secure: secure,
            sameSite: sameSite,
            ignoreMethods: ignoreMethods
        });
    };
    //Manage token for each request
    Security.prototype.manageToken = function (req, res, next) {
        var csrfToken = req.csrfToken();
        res.cookie('XSRF-TOKEN', csrfToken);
        res.locals._csrf = csrfToken;
        var securityModel = env_config_1.EnvConfig.getSecurity();
        for (var _i = 0, _a = securityModel.headers; _i < _a.length; _i++) {
            var header = _a[_i];
            switch (header.type.toUpperCase()) {
                case 'ADD':
                    res.header(header.name, header.value);
                    break;
                case 'REMOVE':
                    res.removeHeader(header.value);
                    break;
                default: break;
            }
        }
        next();
    };
    Security.prototype.manageTransactionId = function (req, res, next) {
        var allCookies = Security.parseCookies(req.headers.cookie);
        if (allCookies && !allCookies.TransactionId) {
            res.cookie('TransactionId', uuid.v4());
        }
        next();
    };
    Security.parseCookies = function (cookie) {
        if (!cookie) {
            return null;
        }
        return cookie.split(';').reduce(function (prev, curr) {
            var m = / *([^=]+)=(.*)/.exec(curr);
            var key = m[1];
            var value = decodeURIComponent(m[2]);
            prev[key] = value;
            return prev;
        }, {});
    };
    Security.prototype.setupServer = function () {
        var isHttps = this.serverModel.useCertificate;
        var server;
        if (isHttps) {
            server = https.createServer(this.getHttpsOptions, this.express).listen(this.serverModel.port, this.serverModel.host);
        }
        else {
            server = http.createServer(this.express).listen(this.serverModel.port, this.serverModel.host);
        }
        this.logServerDetails();
    };
    Security.prototype.getHttpsOptions = function () {
        return {
            cert: fs.readFileSync(this.serverModel.certPath),
            key: fs.readFileSync(this.serverModel.certKey),
            passphrase: this.serverModel.passPhrase
        };
    };
    Security.prototype.logServerDetails = function () {
        console.log("Listening to " + this.serverModel.host);
        console.log("Port - " + this.serverModel.port);
    };
    return Security;
}());
exports.Security = Security;
