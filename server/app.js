"use strict";
exports.__esModule = true;
var path = require("path");
var favicon = require("serve-favicon");
var express = require("express");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var compress = require("compression");
var cors = require("cors");
var routes_1 = require("./routes/routes");
var env_config_1 = require("./env.config");
var helpers_1 = require("./helpers/helpers");
var App = (function () {
    function App() {
        this.serverModel = env_config_1.EnvConfig.getServer();
        this.logModel = env_config_1.EnvConfig.getLog();
        this.expressApp = express();
        this.middleware();
        this.routes();
    }
    App.prototype.middleware = function () {
        this.expressApp.use(favicon(path.join(__dirname, '..', this.serverModel.deploymentFolder + "/favicon.ico")));
        this.expressApp.use(compress());
        this.expressApp.use(morgan('combined', { stream: helpers_1.Logger.getStream() }));
        this.expressApp.use(cors());
        this.expressApp.use(bodyParser.json());
        this.expressApp.use(methodOverride());
        this.security = new helpers_1.Security(this.expressApp);
        this.expressApp.use(express.static(path.join(__dirname, "../" + this.serverModel.deploymentFolder)));
        this.expressApp.use('/*', express.static(path.join(__dirname, "../" + this.serverModel.deploymentFolder + "/index.html")));
    };
    App.prototype.routes = function () {
        var searchRouter = new routes_1.SearchRouter(this.expressApp), benchmarkRouter = new routes_1.BenchmarkRouter(this.expressApp);
    };
    return App;
}());
exports.App = App;
