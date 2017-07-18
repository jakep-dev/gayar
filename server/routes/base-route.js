"use strict";
exports.__esModule = true;
var https = require("https");
var http = require("http");
var querystring = require("querystring");
var env_config_1 = require("../env.config");
var helpers_1 = require("../helpers/helpers");
var BaseRoute = (function () {
    function BaseRoute() {
        BaseRoute.apiModel = env_config_1.EnvConfig.getApi();
    }
    //Perform get request operation based on https or http
    BaseRoute.prototype.PerformGetRequest = function (endpoint, data, success) {
        var dataString = JSON.stringify(data), path = env_config_1.EnvConfig.getContractByName(endpoint) + "?" + querystring.stringify(data), headers = {
            'Content-Type': 'application/json',
            'Content-Length': dataString.length
        }, options = {
            host: BaseRoute.apiModel.host,
            path: path,
            method: 'GET',
            port: BaseRoute.apiModel.port
        };
        var handler = BaseRoute.apiModel.protocol === 'https' ? https : http;
        var req = handler.request(options, function (res) {
            res.setEncoding('utf-8');
            var responseString = '';
            res.on('data', function (data) {
                responseString += data;
            });
            res.on('end', function () {
                var responseObject = JSON.parse(responseString);
                success(responseObject);
            });
            req.on('error', function (e) {
                helpers_1.Logger.error(e);
            });
        });
        req.write(dataString);
        req.end();
    };
    //Perform post request operation based on https or http
    BaseRoute.prototype.PerformPostRequest = function (endpoint, data, success) {
        var postData = querystring.stringify(data), path = env_config_1.EnvConfig.getContractByName(endpoint) + "?" + querystring.stringify(data), headers = {
            'Content-Type': 'application/json',
            'Content-Length': postData.length
        }, options = {
            host: BaseRoute.apiModel.host,
            path: path,
            method: 'POST',
            headers: headers,
            port: BaseRoute.apiModel.port
        };
        var handler = BaseRoute.apiModel.protocol === 'https' ? https : http;
        var req = handler.request(options, function (res) {
            res.setEncoding('utf-8');
            var responseString = '';
            res.on('data', function (data) {
                responseString += data;
            });
            res.on('end', function () {
                var responseObject = JSON.parse(responseString);
                success(responseObject, res);
            });
            req.on('error', function (e) {
                helpers_1.Logger.error(e);
            });
        });
        req.write(postData);
        req.end();
    };
    return BaseRoute;
}());
exports.BaseRoute = BaseRoute;
