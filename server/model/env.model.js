"use strict";
exports.__esModule = true;
var EnvConfigModel = (function () {
    function EnvConfigModel() {
        this.init();
    }
    EnvConfigModel.prototype.init = function () {
        this.Server = new ServerModel();
        this.Api = new ApiModel();
        this.Security = new SecurityModel();
        this.Log = new LogModel();
    };
    return EnvConfigModel;
}());
exports.EnvConfigModel = EnvConfigModel;
var ServerModel = (function () {
    function ServerModel() {
    }
    return ServerModel;
}());
exports.ServerModel = ServerModel;
var ApiModel = (function () {
    function ApiModel() {
    }
    return ApiModel;
}());
exports.ApiModel = ApiModel;
var SecurityModel = (function () {
    function SecurityModel() {
    }
    return SecurityModel;
}());
exports.SecurityModel = SecurityModel;
var LogModel = (function () {
    function LogModel() {
    }
    return LogModel;
}());
exports.LogModel = LogModel;
