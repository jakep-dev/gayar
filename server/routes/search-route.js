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
var SearchRouter = (function (_super) {
    __extends(SearchRouter, _super);
    function SearchRouter(app) {
        var _this = _super.call(this) || this;
        _this.app = app;
        _this.init();
        return _this;
    }
    //Perform the company search based on searchtype and searchvalue
    //SearchType = COMP_NAME | COMP_ID | TICKER | DUNS
    SearchRouter.prototype.doCompanySearch = function (req, res, next) {
        try {
            _super.prototype.PerformGetRequest.call(this, "companySearch", {
                'ssnid': 'testtoken',
                'search_type': req.body.searchType,
                'search_value': req.body.searchValue
            }, function (data) {
                res.send(data);
            });
        }
        catch (e) {
            helpers_1.Logger.error(e);
        }
    };
    //Get all available industries
    SearchRouter.prototype.getIndustries = function (req, res, next) {
        try {
            _super.prototype.PerformGetRequest.call(this, "getIndustries", {
                'ssnid': 'testtoken'
            }, function (data) {
                res.send(data);
            });
        }
        catch (e) {
            helpers_1.Logger.error(e);
        }
    };
    //Initialize all the api call endpoints
    SearchRouter.prototype.init = function () {
        this.app.post('/api/doCompanySearch', this.doCompanySearch);
        this.app.post('/api/getIndustries', this.getIndustries);
    };
    return SearchRouter;
}(base_route_1.BaseRoute));
exports.SearchRouter = SearchRouter;
