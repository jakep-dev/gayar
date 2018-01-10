import { Component, OnInit } from '@angular/core';
import { MenuService, ReportService, SessionService, SearchService } from 'app/services/services';
import { IReportTileModel } from 'app/model/model';
import { APPCONSTANTS } from 'app/app.const';
import { SnackBarService } from 'app/shared/shared';

@Component({
    selector: 'app-report',
    templateUrl: 'report.component.html',
    styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

    //list of high level report sections
    public reportTileModel: Array<IReportTileModel> = null;

    //boolean to indicate report data is loaded
    private reportDataDone: boolean = false;

    //boolean to indicate frequency is enabled
    private enableFrequency: boolean = false;

    //boolean to indicate severity is enabled
    private enableSeverity: boolean = false;

    //boolean to indicate benchmark gauge is enabled
    private enableBenchmarkGauge: boolean = false;

    //boolean to indicate company loss table for severity & frequency is enabled
    private enableCompanyLossTable: boolean = false;

    constructor(
        private menuService: MenuService,
        private reportService: ReportService,
        private sessionService: SessionService,
        private searchService: SearchService,
        private snackBarService: SnackBarService) {
    }

    /**
     * ngOnInit - Fires on initial load and loads the
     * 
     * @return {} - No return types.
     */
    ngOnInit() {
        this.menuService.breadCrumb = 'Report';
        if(this.sessionService) {
            try {
                let token: string = this.sessionService.Token;
            } catch {
                this.sessionService.restoreIdentity();
            }
        }

        this.buildRules();

        //Call report service to get report structure
        this.getReportConfig();
    }

    /**
     * buildRules - build variables for report rules
     *
     * @private
     * @function buildRules
     * @return {} - No return types.
     */
    private buildRules() {
        let peerGroupValidation = this.searchService.checkValidationPeerGroup();
        this.enableCompanyLossTable = this.searchService.getSearchType !== 'SEARCH_BY_MANUAL_INPUT';

        if( peerGroupValidation ) {
            this.enableFrequency = peerGroupValidation.hasFrequencyData;
            this.enableSeverity = peerGroupValidation.hasSeverityData;
        }

        if( this.searchService.getLimit && this.searchService.getRetention ) {
            this.enableBenchmarkGauge = true;
        }

    }

    /**
     * getReportConfig - Load the report configuration.
     *
     * @private
     * @function getReportConfig
     * @return {} - No return types.
     */
    private getReportConfig () {
        this.reportService.getReportConfig().subscribe((data)=> {
            this.reportTileModel = data;
            this.buildReportPermission();
            this.setupDashboardRules();
            //console.log('Report Data Done!');
            this.reportDataDone = true;
        });
    }

    /**
     * buildReportPermission - build the report permission 
     * 
     * @private
     * @function buildReportPermission
     * return {} - No return types
     */
    private buildReportPermission() {
        this.reportTileModel.forEach( reportComponent => {
            reportComponent.hasAccess = this.getPageAccess(reportComponent.id);
            reportComponent.value = reportComponent.hasAccess;
            if(reportComponent.subComponents && reportComponent.subComponents.length > 0) {
                reportComponent.subComponents.forEach( reportSubComponent => {
                    reportSubComponent.hasAccess = (reportComponent.hasAccess)? this.getComponentAccess(reportSubComponent.id) : false;
                    reportSubComponent.value = reportSubComponent.hasAccess;
                    if(reportSubComponent.chartComponents && reportSubComponent.chartComponents.length > 0) {
                        reportSubComponent.chartComponents.forEach(chartMetdata => 
                            {
                                chartMetdata.hasAccess = this.getChartAccess(chartMetdata.id)
                            }
                        );
                    }
                    if(reportSubComponent.subSubComponents && reportSubComponent.subSubComponents.length > 0) {
                        reportSubComponent.subSubComponents.forEach ( chartDetails => {
                            chartDetails.hasAccess = (reportSubComponent.hasAccess)? this.getChartDetailAccess(reportSubComponent.id): false;
                            chartDetails.value = chartDetails.hasAccess;
                            if(chartDetails.chartComponents && chartDetails.chartComponents.length > 0) {
                                chartDetails.chartComponents.forEach(chartMetadata =>
                                    {
                                        chartMetadata.hasAccess = this.getChartAccess(chartMetadata.id);
                                    }
                                );
                            }
                        });
                    }
                });
            }
        });
    }

    /**
     * getPageAccess - get the page access
     * 
     * @private
     * @function getPageAccess
     * @param id - id of the page
     * @return {boolean} - true if the page has access, otherwise false
     */
    private getPageAccess(id:string) {
        let permission = this.sessionService.getUserPermission();
        switch(id) {
            case APPCONSTANTS.REPORTS_ID.dashboardPage:
                return permission && permission.dashboard && permission.dashboard.hasAccess;
            case APPCONSTANTS.REPORTS_ID.frequencyPage:
            return permission && permission.frequency && permission.frequency.hasAccess && this.enableFrequency;
            case APPCONSTANTS.REPORTS_ID.severityPage:
                return permission && permission.severity && permission.severity.hasAccess && this.enableSeverity;
            case APPCONSTANTS.REPORTS_ID.benchmarkPage:
                return permission && permission.benchmark && permission.benchmark.hasAccess;
            case APPCONSTANTS.REPORTS_ID.appendixPage:
                return permission && permission.glossary && permission.glossary.hasAccess;
            default:
                return false;
        }
    }

    /**
     * getComponentAccess - get the component access
     * 
     * @private
     * @function getComponentAccess
     * @param id - id of the component
     * @return {boolean} - true if the component has access, otherwise false
     */
    private getComponentAccess(id: string) {
        let permission = this.sessionService.getUserPermission();
        switch(id) {

            //dashboard components
            case APPCONSTANTS.REPORTS_ID.frequencyGauge:
            return permission && permission.dashboard && permission.dashboard.frequencyGauge && permission.dashboard.frequencyGauge.hasAccess && this.enableFrequency;
            case APPCONSTANTS.REPORTS_ID.severityGauge:
                return permission && permission.dashboard && permission.dashboard.severityGauge && permission.dashboard.severityGauge.hasAccess && this.enableSeverity;
            case APPCONSTANTS.REPORTS_ID.benchmarkGauge:
                return permission && permission.dashboard && permission.dashboard.benchmarkGauge && permission.dashboard.benchmarkGauge.hasAccess && this.enableBenchmarkGauge;

            //frequency components
            case APPCONSTANTS.REPORTS_ID.frequencyIndustry:
                return permission && permission.frequency && permission.frequency.industry && permission.frequency.industry.hasAccess;
            case APPCONSTANTS.REPORTS_ID.frequencyTimePeriod:
                return permission && permission.frequency && permission.frequency.timePeriod && permission.frequency.timePeriod.hasAccess;
            case APPCONSTANTS.REPORTS_ID.frequencyIncident:
                return permission && permission.frequency && permission.frequency.incident && permission.frequency.incident.hasAccess;
            case APPCONSTANTS.REPORTS_ID.frequencyLoss:
                return permission && permission.frequency && permission.frequency.loss && permission.frequency.loss.hasAccess;
            case APPCONSTANTS.REPORTS_ID.frequencyPeerLosses:
                return permission && permission.frequency && permission.frequency.peerGroupTable && permission.frequency.peerGroupTable.hasAccess;
            case APPCONSTANTS.REPORTS_ID.frequencyCompanyLosses:
            return permission && permission.frequency && permission.frequency.companyTable && permission.frequency.companyTable.hasAccess && this.enableCompanyLossTable;
            
            //severity components
            case APPCONSTANTS.REPORTS_ID.severityIdustry:
                return permission && permission.severity && permission.severity.industry && permission.severity.industry.hasAccess;
            case APPCONSTANTS.REPORTS_ID.severityTimePeriod:
                return permission && permission.severity && permission.severity.timePeriod && permission.severity.timePeriod.hasAccess;
            case APPCONSTANTS.REPORTS_ID.severityIncident:
                return permission && permission.severity && permission.severity.incident && permission.severity.incident.hasAccess;
            case APPCONSTANTS.REPORTS_ID.severityLoss:
                return permission && permission.severity && permission.severity.loss && permission.severity.loss.hasAccess;
            case APPCONSTANTS.REPORTS_ID.severityPeerLosses:
                return permission && permission.severity && permission.severity.peerGroupTable && permission.severity.peerGroupTable.hasAccess;
            case APPCONSTANTS.REPORTS_ID.severityCompanyLosses:
            return permission && permission.severity && permission.severity.companyTable && permission.severity.companyTable.hasAccess && this.enableCompanyLossTable;
            
            //benchmark components
            case APPCONSTANTS.REPORTS_ID.benchmarkLimitAdequacy:
                return permission && permission.severity && permission.benchmark.limitAdequacy && permission.benchmark.limitAdequacy.hasAccess;
            case APPCONSTANTS.REPORTS_ID.benchmarkPremium:
                return permission && permission.severity && permission.benchmark.premium && permission.benchmark.premium.hasAccess;
            case APPCONSTANTS.REPORTS_ID.benchmarkLimit:
                return permission && permission.severity && permission.benchmark.limit && permission.benchmark.limit.hasAccess;
            case APPCONSTANTS.REPORTS_ID.benchmarkRetention:
                return permission && permission.severity && permission.benchmark.retention && permission.benchmark.retention.hasAccess;
            case APPCONSTANTS.REPORTS_ID.benchmarkRate:
                return permission && permission.severity && permission.benchmark.rate && permission.benchmark.rate.hasAccess;

            //glossary
            case APPCONSTANTS.REPORTS_ID.glossary:
                return permission && permission.glossary && permission.glossary && permission.glossary.hasAccess;

            default: 
                return false;
        }
    }

    /**
     * getChartDetailAccess - get the chart detail access
     * 
     * @private
     * @function getChartDetailAccess
     * @param id - id of the chart detail
     * @return {boolean} - true if the chart detail has access, otherwise false
     */
    private getChartDetailAccess(id: string) {
        let permission = this.sessionService.getUserPermission();
        switch(id) {

            //frequency detailed charts
            case APPCONSTANTS.REPORTS_ID.frequencyTimePeriodDetails:
                return permission && permission.frequency && permission.frequency.timePeriod.hasAccess && permission.frequency.timePeriod.hasDetailAccess;
            case APPCONSTANTS.REPORTS_ID.frequencyIncident:
                return permission && permission.frequency && permission.frequency.incident && permission.frequency.incident.hasDetailAccess;
            case APPCONSTANTS.REPORTS_ID.frequencyLoss:
                return permission && permission.frequency && permission.frequency.loss && permission.frequency.loss.hasDetailAccess;
            
            //severity detailed charts
            case APPCONSTANTS.REPORTS_ID.severityTimePeriodDetails:
                return permission && permission.severity && permission.severity.timePeriod.hasAccess && permission.severity.timePeriod.hasDetailAccess;
            case APPCONSTANTS.REPORTS_ID.severityIncident:
                return permission && permission.severity && permission.severity.incident && permission.severity.incident.hasDetailAccess;
            case APPCONSTANTS.REPORTS_ID.severityLoss:
                return permission && permission.severity && permission.severity.loss && permission.severity.loss.hasDetailAccess;
            
            default: 
                return false;
        }
    }

    /**
     * getChartAccess - get the chart access
     * 
     * @private
     * @function getChartAccess
     * @param id - id of the chart
     * @return {boolean} - true if the chart is rendered, otherwise false
     */
    private getChartAccess(id: string) {
        let permission = this.sessionService.getUserPermission();
        switch(id) {
            //dashboard page charts
            case APPCONSTANTS.REPORTS_ID.frequencyGaugeChart:
                return permission && permission.dashboard && permission.dashboard.frequencyGauge && permission.dashboard.frequencyGauge.hasAccess;
            case APPCONSTANTS.REPORTS_ID.severityGaugeChart:
                return permission && permission.dashboard && permission.dashboard.severityGauge && permission.dashboard.severityGauge.hasAccess;
            case APPCONSTANTS.REPORTS_ID.benchmarkGaugeChart:
                return permission && permission.dashboard && permission.dashboard.benchmarkGauge && permission.dashboard.benchmarkGauge.hasAccess;

            //frequency industry overview page chart
            case APPCONSTANTS.REPORTS_ID.frequencyIndustryChart:
                return permission && permission.frequency && permission.frequency.industry && permission.frequency.industry.hasAccess;
            
            //frequency time period page charts
            case APPCONSTANTS.REPORTS_ID.frequencyTimePeriodChart:
                return permission && permission.frequency && permission.frequency.timePeriod && permission.frequency.timePeriod.hasAccess;
            case APPCONSTANTS.REPORTS_ID.frequencyTimePeriodDetails:
                return permission && permission.frequency && permission.frequency.timePeriod && permission.frequency.timePeriod.hasDetailAccess;
            
            //frequency type of incident overview page charts
            case APPCONSTANTS.REPORTS_ID.frequencyIncidentBarChart:
            case APPCONSTANTS.REPORTS_ID.frequencyIncidentPieChart:
                return permission && permission.frequency && permission.frequency.incident && permission.frequency.incident.hasAccess;
            
            //frequency type of incident data privacy page charts
            case APPCONSTANTS.REPORTS_ID.frequencyIncidentDataBarChart:
            case APPCONSTANTS.REPORTS_ID.frequencyIncidentDataPieChart:
            //frequency type of incident network security page charts
            case APPCONSTANTS.REPORTS_ID.frequencyIncidentNetworkDataBarChart:
            case APPCONSTANTS.REPORTS_ID.frequencyIncidentNetworkPieChart:
            //frequency type of incident tech e&o page charts
            case APPCONSTANTS.REPORTS_ID.frequencyIncidentTechBarChart:
            case APPCONSTANTS.REPORTS_ID.frequencyIncidentTechPieChart:
            //frequency type of incident privacy violations page charts
            case APPCONSTANTS.REPORTS_ID.frequencyIncidentPrivacyBarChart:
            case APPCONSTANTS.REPORTS_ID.frequencyIncidentPrivacyPieChart:
                return permission && permission.frequency && permission.frequency.incident && permission.frequency.incident.hasDetailAccess;

            //frequency type of loss overview page charts
            case APPCONSTANTS.REPORTS_ID.frequencyLossBarChart:
            case APPCONSTANTS.REPORTS_ID.frequencyLossPieChart:
                return permission && permission.frequency && permission.frequency.loss && permission.frequency.loss.hasAccess;

            //frequency type of loss personal information page charts
            case APPCONSTANTS.REPORTS_ID.frequencyLossPersonalBarChart:
            case APPCONSTANTS.REPORTS_ID.frequencyLossPersonalPieChart:
            //frequency type of loss corporate losses page charts
            case APPCONSTANTS.REPORTS_ID.frequencyLossCorporateBarChart:
            case APPCONSTANTS.REPORTS_ID.frequencyLossCorporatePieChart:
                return permission && permission.frequency && permission.frequency.loss && permission.frequency.loss.hasDetailAccess

            //severity industry overview page chart
            case APPCONSTANTS.REPORTS_ID.severityIdustryChart:
                return permission && permission.severity && permission.severity.industry && permission.severity.industry.hasAccess;

            //severity time period page charts
            case APPCONSTANTS.REPORTS_ID.severityTimePeriodChart:
                return permission && permission.severity && permission.severity.timePeriod && permission.severity.timePeriod.hasAccess;
            case APPCONSTANTS.REPORTS_ID.severityTimePeriodDetails:
                return permission && permission.severity && permission.severity.timePeriod && permission.severity.timePeriod.hasDetailAccess;

            //severity type of incident overview page charts
            case APPCONSTANTS.REPORTS_ID.severityIncidentBarChart:
            case APPCONSTANTS.REPORTS_ID.severityIncidentPieChart:
                return permission && permission.severity && permission.severity.incident && permission.severity.incident.hasAccess;

            //severity type of incident data privacy page charts
            case APPCONSTANTS.REPORTS_ID.severityIncidentDataBarChart:
            case APPCONSTANTS.REPORTS_ID.severityIncidentDataPieChart:
            //severity type of incident network security page charts
            case APPCONSTANTS.REPORTS_ID.severityIncidentNetworkDataBarChart:
            case APPCONSTANTS.REPORTS_ID.severityIncidentNetworkPieChart:
            //severity type of incident tech e&o page charts
            case APPCONSTANTS.REPORTS_ID.severityIncidentTechBarChart:
            case APPCONSTANTS.REPORTS_ID.severityIncidentTechPieChart:
            //severity type of incident privacy violations page charts
            case APPCONSTANTS.REPORTS_ID.severityIncidentPrivacyBarChart:
            case APPCONSTANTS.REPORTS_ID.severityIncidentPrivacyPieChart:
                return permission && permission.severity && permission.severity.incident && permission.severity.incident.hasDetailAccess;

            //severity type of loss overview page charts
            case APPCONSTANTS.REPORTS_ID.severityLossBarChart:
            case APPCONSTANTS.REPORTS_ID.severityLossPieChart:
                return permission && permission.severity && permission.severity.loss && permission.severity.loss.hasAccess;

            //severity type of loss personal information page charts
            case APPCONSTANTS.REPORTS_ID.severityLossPersonalBarChart:
            case APPCONSTANTS.REPORTS_ID.severityLossPersonalPieChart:
            //severity type of loss corporate losses page charts
            case APPCONSTANTS.REPORTS_ID.severityLossCorporateBarChart:
            case APPCONSTANTS.REPORTS_ID.severityLossCorporatePieChart:
                return permission && permission.severity && permission.severity.loss && permission.severity.loss.hasDetailAccess;

            //benchmark page charts
            case APPCONSTANTS.REPORTS_ID.benchmarkLimitAdequacyChart:
                return permission && permission.severity && permission.benchmark.limitAdequacy && permission.benchmark.limitAdequacy.hasAccess;
            case APPCONSTANTS.REPORTS_ID.benchmarkPremiumChart:
                return permission && permission.severity && permission.benchmark.premium && permission.benchmark.premium.hasAccess;
            case APPCONSTANTS.REPORTS_ID.benchmarkLimitChart:
                return permission && permission.severity && permission.benchmark.limit && permission.benchmark.limit.hasAccess;
            case APPCONSTANTS.REPORTS_ID.benchmarkRetentionChart:
                return permission && permission.severity && permission.benchmark.retention && permission.benchmark.retention.hasAccess;
            case APPCONSTANTS.REPORTS_ID.benchmarkRateChart:
                return permission && permission.severity && permission.benchmark.rate && permission.benchmark.rate.hasAccess;
            default: 
                return false;
        }
    }

    /**
     * setup special rule for dashboard
     * disable all components but checked
     * 
     * @private
     * @function setupDashboardRules
     * @return {} - No return types.
     */
    private setupDashboardRules() {
        let dashboardComponents = this.reportTileModel.find( dashboard => {
            return dashboard.id === APPCONSTANTS.REPORTS_ID.dashboardPage;
        });

        if(dashboardComponents && dashboardComponents.hasAccess) {
            dashboardComponents.hasAccess = false;
            dashboardComponents.value = true;

            if(dashboardComponents.subComponents && dashboardComponents.subComponents.length > 0) {
                dashboardComponents.subComponents.forEach( subComponents => {
                    if( subComponents.hasAccess) {
                        subComponents.hasAccess = false;
                        subComponents.value = true;
                    }
                });
                dashboardComponents.value = dashboardComponents.subComponents.some( subComponents => subComponents.value);
            }
        }
    }

    /**
     * Response to the download report button
     * Continuosly wait for all resources and data are loaded before starting the pdf generation process
     * 
     * @public
     * @function onReport
     * @return {} - No return types.
     */
    public onReport () {
        this.getReportMessage();
        if(this.hasSelectedComponent()) {
            this.menuService.startPdfDownload(this.reportTileModel);
        }
    }

    /**
     * Generate message for different rules upon click the report button
     * 
     * @private
     * @function getReportMessage
     * @return {} - No return types.
     */
    private getReportMessage() {
        let message: string = null;

        let selectedComponents = this.reportTileModel.filter( components => {
            return components.subComponents.some( subComponents => subComponents.value);
        });

        if(selectedComponents && selectedComponents.length === 1) {
            if( (!this.enableBenchmarkGauge) && 
                (!this.enableFrequency) && 
                (!this.enableSeverity) && 
                selectedComponents[0].id === APPCONSTANTS.REPORTS_ID.benchmarkPage) {
                    message = 'Report will have Benchmark charts only as the selected peer group has no associated losses.';
            } else if (selectedComponents[0].id === APPCONSTANTS.REPORTS_ID.dashboardPage) {
                let selectedDescription = selectedComponents[0].subComponents.filter( gauge => {
                    if( gauge.value) {
                        return gauge;
                    }
                }).map( gauge => gauge.description);
                let mergedString = [selectedDescription.slice(0, -1).join(', '), selectedDescription.slice(-1)[0]].join(selectedDescription.length < 2 ? '' : ' and ');
                message = 'Report will have the Dashboard page with ' + mergedString + ' scores.';
            }
        } else if(!selectedComponents || selectedComponents.length === 0){
            message = 'Report cannot be generated as there are no components selected.';
        }

        if(message) {
            this.snackBarService.Simple(message);
        }
    }

    /**
     * Checks if has a report to download
     * 
     * @private
     * @function hasSelectedComponent
     * @return {boolean} - true if it has selected component, otherwise false
     */
    private hasSelectedComponent(): boolean {
        let selectedComponents = this.reportTileModel.filter( components => {
            return components.subComponents.some( subComponents => subComponents.value);
        });

        return (selectedComponents && selectedComponents.length > 0);
    }

}
