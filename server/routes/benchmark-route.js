"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var base_route_1 = require("./base-route");
var helpers_1 = require("../helpers/helpers");
var BenchmarkRouter = (function (_super) {
    __extends(BenchmarkRouter, _super);
    function BenchmarkRouter(app) {
        var _this = _super.call(this) || this;
        _this.app = app;
        _this.init();
        return _this;
    }
    //Get the chart data by companyId
    //Premium, Limit and Retention Chart dataset
    BenchmarkRouter.prototype.getChartDataByCompanyId = function (req, res, next) {
        try {
            _super.prototype.PerformGetRequest.call(this, "getDistributionDataSet", {
                'client_value': req.body.clientValue,
                'chart_type': req.body.chartType,
                'company_id': req.body.companyId
            }, function (data) {
                res.send(data);
            });
        }
        catch (e) {
            helpers_1.Logger.error(e);
        }
    };
    //Get the chart data by manual input
    //Premium, Limit and Retention Chart dataset
    BenchmarkRouter.prototype.getChartDataByManualInput = function (req, res, next) {
        try {
            _super.prototype.PerformGetRequest.call(this, "getDistributionDataSet", {
                'client_value': req.body.clientValue,
                'naics': req.body.naics,
                'revenue_range': req.body.revenueRange
            }, function (data) {
                res.send(data);
            });
        }
        catch (e) {
            helpers_1.Logger.error(e);
        }
    };
    //Get rate per million chart details
    BenchmarkRouter.prototype.getRatePerMillion = function (req, res, next) {
        try {
            _super.prototype.PerformGetRequest.call(this, "ratePerMillion", {
                'company_id': req.body.companyId,
                'ssnid': req.body.token
            }, function (data) {
                res.send(data);
            });
        }
        catch (e) {
            helpers_1.Logger.error(e);
        }
    };
    //Get limit adequacy chart details
    BenchmarkRouter.prototype.getLimitAdequacy = function (req, res, next) {
        try {
            _super.prototype.PerformGetRequest.call(this, "getLimitAdequacy", {
                'company_id': req.body.companyId,
                'ssnid': req.body.token,
                'limit': req.body.limit
            }, function (data) {
                res.send(data);
            });
        }
        catch (e) {
            helpers_1.Logger.error(e);
        }
    };
    BenchmarkRouter.prototype.init = function () {
        this.app.post('/api/getChartDataByCompanyId', this.getChartDataByCompanyId);
        this.app.post('/api/getChartDataByManualInput', this.getChartDataByManualInput);
        this.app.post('/api/getRatePerMillion', this.getRatePerMillion);
        this.app.post('/api/getLimitAdequacy', this.getLimitAdequacy);
    };
    return BenchmarkRouter;
}(base_route_1.BaseRoute));
exports.BenchmarkRouter = BenchmarkRouter;
