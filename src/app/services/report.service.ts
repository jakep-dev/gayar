import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { IReportTileModel } from 'app/model/model';

@Injectable()
export class ReportService {
    constructor() {  }

    public getReportConfig () : Observable<Array<IReportTileModel>> {
        let subject = new Subject<Array<IReportTileModel>>();
        try {
            setTimeout(() => {
                subject.next(REPORT_CONFIGURATION);
                subject.complete();
            }, 0);
        }
        catch (e) {
        }
        return subject;
    }

}

const REPORT_CONFIGURATION: Array<IReportTileModel> = [
    {
        id: 'REPORT_TILE_DASHBOARD',
        description: 'Dashboard',
        value: true,
        hasAccess: false,
        subComponents: [
            {
                description: 'Frequency',
                id: 'REPORT_DASHBOARD_FREQUENCY',
                value: true,
                hasAccess: false,
                pageType: 'DashboardPage',
                chartComponents: [
                    {
                        componentName: 'app-dashboard-frequency',
                        pagePosition: 0,
                        drillDownName: '',
                        id: 'REPORT_DASHBOARD_FREQUENCY_CHART',
                        hasAccess: false
                    }
                ],
                subSubComponents: null
            },
            {
                description: 'Severity',
                id: 'REPORT_DASHBOARD_SEVERITY',
                value: true,
                hasAccess: false,
                pageType: 'DashboardPage',
                chartComponents: [
                    {
                        componentName: 'app-dashboard-severity',
                        pagePosition: 1,
                        drillDownName: '',
                        id: 'REPORT_DASHBOARD_SEVERITY_CHART',
                        hasAccess: false
                    }
                ],
                subSubComponents: null
            },
            {
                description: 'Benchmark',
                id: 'REPORT_DASHBOARD_BENCHMARK',
                value: true,
                hasAccess: false,
                pageType: 'DashboardPage',
                chartComponents: [
                    {
                        componentName: 'dashboard-benchmark-score',
                        pagePosition: 2,
                        drillDownName: '',
                        id: 'REPORT_DASHBOARD_BENCHMARK_CHART',
                        hasAccess: false
                    }
                ],
                subSubComponents: null
            }
        ]
    },

    {
        id: 'REPORT_TILE_FREQUENCY',
        description: 'Frequency',
        value: true,
        hasAccess: false,
        subComponents: [
            {
                description: 'Industry Overview',
                id: 'REPORT_FREQUENCY_INDUSTRY_OVERVIEW',
                value: true,
                hasAccess: false,
                pageType: 'FrequencyIndustryOverviewPage',
                chartComponents: [
                    {
                        componentName: 'frequency-industry-overview',
                        pagePosition: 0,
                        drillDownName: '',
                        id: 'REPORT_FREQUENCY_INDUSTRY_OVERVIEW_CHART',
                        hasAccess: false
                    }
                ],
                subSubComponents: null
            },
            {
                description: 'Time Period',
                id: 'REPORT_FREQUENCY_TIME_PERIOD',
                value: true,
                hasAccess: false,
                pageType: 'FrequencyTimePeriodPage',
                chartComponents: [
                    {
                        componentName: 'frequency-time-period',
                        pagePosition: 0,
                        drillDownName: '',
                        id: 'REPORT_FREQUENCY_TIME_PERIOD_CHART',
                        hasAccess: false
                    },
                    {
                        componentName: 'frequency-time-period',
                        pagePosition: 1,
                        drillDownName: 'Past 10 years',
                        id: 'REPORT_FREQUENCY_TIME_PERIOD_DETAILS',
                        hasAccess: false
                    }
                ],
                subSubComponents: null
            },
            {
                description: 'Type of Incident',
                id: 'REPORT_FREQUENCY_TYPE_OF_INCIDENT',
                value: true,
                hasAccess: false,
                pageType: 'FrequencyTypeOfIncidentPage',
                chartComponents: [
                    {
                        componentName: 'frequency-incident-bar',
                        pagePosition: 0,
                        drillDownName: '',
                        id: 'REPORT_FREQUENCY_TYPE_OF_INCIDENT_BAR_CHART',
                        hasAccess: false
                    },
                    {
                        componentName: 'frequency-incident-pie',
                        pagePosition: 1,
                        drillDownName: '',
                        id: 'REPORT_FREQUENCY_TYPE_OF_INCIDENT_PIE_CHART',
                        hasAccess: false
                    }
                ],
                subSubComponents: [
                    {
                        description: 'Data Privacy',
                        id: 'REPORT_FREQUENCY_INCIDENT_DATA_PRIVACY',
                        value: true,
                        hasAccess: false,
                        pageType: 'FrequencyDataPrivacyPage',
                        chartComponents: [
                            {
                                componentName: 'frequency-incident-bar',
                                pagePosition: 0,
                                drillDownName: 'Data Privacy',
                                id: 'REPORT_FREQUENCY_TYPE_OF_INCIDENT_DATA_BAR_CHART',
                                hasAccess: false
                            },
                            {
                                componentName: 'frequency-incident-pie',
                                pagePosition: 1,
                                drillDownName: 'Data Privacy',
                                id: 'REPORT_FREQUENCY_TYPE_OF_INCIDENT_DATA_PIE_CHART',
                                hasAccess: false
                            }
                        ]
                    },
                    {
                        description: 'Network Security',
                        id: 'REPORT_FREQUENCY_INCIDENT_NETWORK_SECURITY',
                        value: true,
                        hasAccess: false,
                        pageType: 'FrequencyNetworkSecurityPage',
                        chartComponents: [
                            {
                                componentName: 'frequency-incident-bar',
                                pagePosition: 0,
                                drillDownName: 'Network Security',
                                id: 'REPORT_FREQUENCY_TYPE_OF_INCIDENT_NETWORK_BAR_CHART',
                                hasAccess: false
                            },
                            {
                                componentName: 'frequency-incident-pie',
                                pagePosition: 1,
                                drillDownName: 'Network Security',
                                id: 'REPORT_FREQUENCY_TYPE_OF_INCIDENT_NETWORK_PIE_CHART',
                                hasAccess: false
                            }
                        ]
                    },
                    {
                        description: 'Tech E&O',
                        id: 'REPORT_FREQUENCY_INCIDENT_TECH_EO',
                        value: true,
                        hasAccess: false,
                        pageType: 'FrequencyTechEOPage',
                        chartComponents: [
                            {
                                componentName: 'frequency-incident-bar',
                                pagePosition: 0,
                                drillDownName: 'Tech E&O',
                                id: 'REPORT_FREQUENCY_TYPE_OF_INCIDENT_TECH_BAR_CHART',
                                hasAccess: false
                            },
                            {
                                componentName: 'frequency-incident-pie',
                                pagePosition: 1,
                                drillDownName: 'Tech E&O',
                                id: 'REPORT_FREQUENCY_TYPE_OF_INCIDENT_TECH_PIE_CHART',
                                hasAccess: false
                            }
                        ]
                    },
                    {
                        description: 'Privacy Violations',
                        id: 'REPORT_FREQUENCY_INCIDENT_PRIVACY_VIOLATIONS',
                        value: true,
                        hasAccess: false,
                        pageType: 'FrequencyPrivacyViolationsPage',
                        chartComponents: [
                            {
                                componentName: 'frequency-incident-bar',
                                pagePosition: 0,
                                drillDownName: 'Privacy Violations',
                                id: 'REPORT_FREQUENCY_TYPE_OF_INCIDENT_PRIVACY_BAR_CHART',
                                hasAccess: false
                            },
                            {
                                componentName: 'frequency-incident-pie',
                                pagePosition: 1,
                                drillDownName: 'Privacy Violations',
                                id: 'REPORT_FREQUENCY_TYPE_OF_INCIDENT_PRIVACY_PIE_CHART',
                                hasAccess: false
                            }
                        ]
                    }
                ]
            },
            {
                description: 'Type of Loss',
                id: 'REPORT_FREQUENCY_TYPE_OF_LOSS',
                value: true,
                hasAccess: false,
                pageType: 'FrequencyTypeOfLossPage',
                chartComponents: [
                    {
                        componentName: 'frequency-loss-bar',
                        pagePosition: 0,
                        drillDownName: '',
                        id: 'REPORT_FREQUENCY_TYPE_OF_LOSS_BAR_CHART',
                        hasAccess: false
                    },
                    {
                        componentName: 'frequency-loss-pie',
                        pagePosition: 1,
                        drillDownName: '',
                        id: 'REPORT_FREQUENCY_TYPE_OF_LOSS_PIE_CHART',
                        hasAccess: false
                    }
                ],
                subSubComponents: [
                    {
                        description: 'Personal Information',
                        id: 'REPORT_FREQUENCY_LOSS_PERSONAL_INFORMATION',
                        value: true,
                        hasAccess: false,
                        pageType: 'FrequencyPersonalInformationPage',
                        chartComponents: [
                            {
                                componentName: 'frequency-loss-bar',
                                pagePosition: 0,
                                drillDownName: 'Personal Information',
                                id: 'REPORT_FREQUENCY_TYPE_OF_LOSS_PERSONAL_BAR_CHART',
                                hasAccess: false
                            },
                            {
                                componentName: 'frequency-loss-pie',
                                pagePosition: 1,
                                drillDownName: 'Personal Information',
                                id: 'REPORT_FREQUENCY_TYPE_OF_LOSS_PERSONAL_PIE_CHART',
                                hasAccess: false
                            }
                        ]
                    },
                    {
                        description: 'Corporate Losses',
                        id: 'REPORT_FREQUENCY_LOSS_CORPORATE_LOSSES',
                        value: true,
                        hasAccess: false,
                        pageType: 'FrequencyCorporateLossesPage',
                        chartComponents: [
                            {
                                componentName: 'frequency-loss-bar',
                                pagePosition: 0,
                                drillDownName: 'Corporate Losses',
                                id: 'REPORT_FREQUENCY_TYPE_OF_LOSS_CORPORATE_BAR_CHART',
                                hasAccess: false
                            },
                            {
                                componentName: 'frequency-loss-pie',
                                pagePosition: 1,
                                drillDownName: 'Corporate Losses',
                                id: 'REPORT_FREQUENCY_TYPE_OF_LOSS_CORPORATE_BAR_CHART',
                                hasAccess: false
                            }
                        ]
                    }
                ]
            },

            {
                description: 'Most Recent Peer Group Losses',
                id: 'REPORT_FREQUENCY_MOST_RECENT_PEER_GROUP_LOSSES',
                value: true,
                hasAccess: false,
                pageType: 'FrequencyMostRecentPeerGroupLossesPage',
                chartComponents: null,
                subSubComponents: null
            },
            {
                description: 'Most Recent Company Losses',
                id: 'REPORT_FREQUENCY_MOST_RECENT_COMPANY_LOSSES',
                value: true,
                hasAccess: false,
                pageType: 'FrequencyMostRecentCompanyLossesPage',
                chartComponents: null,
                subSubComponents: null
            },
            {
                description: 'Most Recent Company Hierarchy Losses',
                id: 'REPORT_FREQUENCY_MOST_RECENT_HIERARCHY_LOSSES',
                value: true,
                hasAccess: false,
                pageType: 'FrequencyMostRecentCompanyHierarchyLossesPage',
                chartComponents: null,
                subSubComponents: null
            }

        ]
    },

    {
        id: 'REPORT_TILE_SEVERITY',
        description: 'Severity',
        value: true,
        hasAccess: false,
        subComponents: [
            {
                description: 'Industry Overview',
                id: 'REPORT_SEVERITY_INDUSTRY_OVERVIEW',
                value: true,
                hasAccess: false,
                pageType: 'SeverityIndustryOverviewPage',
                chartComponents: [
                    {
                        componentName: 'severity-industry-overview',
                        pagePosition: 0,
                        drillDownName: '',
                        id: 'REPORT_SEVERITY_INDUSTRY_OVERVIEW_CHART',
                        hasAccess: false
                    }
                ],
                subSubComponents: null
            },
            {
                description: 'Time Period',
                id: 'REPORT_SEVERITY_TIME_PERIOD',
                value: true,
                hasAccess: false,
                pageType: 'SeverityTimePeriodPage',
                chartComponents: [
                    {
                        componentName: 'severity-time-period',
                        pagePosition: 0,
                        drillDownName: '',
                        id: 'REPORT_SEVERITY_TIME_PERIOD_CHART',
                        hasAccess: false
                    },
                    {
                        componentName: 'severity-time-period',
                        pagePosition: 1,
                        drillDownName: 'Past 10 years',
                        id: 'REPORT_SEVERITY_TIME_PERIOD_DETAILS',
                        hasAccess: false
                    }
                ],
                subSubComponents: null
            },
            {
                description: 'Type of Incident',
                id: 'REPORT_SEVERITY_TYPE_OF_INCIDENT',
                value: true,
                hasAccess: false,
                pageType: 'SeverityTypeOfIncidentPage',
                chartComponents: [
                    {
                        componentName: 'severity-incident-bar',
                        pagePosition: 0,
                        drillDownName: '',
                        id: 'REPORT_SEVERITY_TYPE_OF_INCIDENT_BAR_CHART',
                        hasAccess: false
                    },
                    {
                        componentName: 'severity-incident-pie',
                        pagePosition: 1,
                        drillDownName: '',
                        id: 'REPORT_SEVERITY_TYPE_OF_INCIDENT_PIE_CHART',
                        hasAccess: false
                    }
                ],
                subSubComponents: [
                    {
                        description: 'Data Privacy',
                        id: 'REPORT_SEVERITY_INCIDENT_DATA_PRIVACY',
                        value: true,
                        hasAccess: false,
                        pageType: 'SeverityDataPrivacyPage',
                        chartComponents: [
                            {
                                componentName: 'severity-incident-bar',
                                pagePosition: 0,
                                drillDownName: 'Data Privacy',
                                id: 'REPORT_SEVERITY_TYPE_OF_INCIDENT_DATA_BAR_CHART',
                                hasAccess: false
                            },
                            {
                                componentName: 'severity-incident-pie',
                                pagePosition: 1,
                                drillDownName: 'Data Privacy',
                                id: 'REPORT_SEVERITY_TYPE_OF_INCIDENT_DATA_PIE_CHART',
                                hasAccess: false
                            }
                        ]
                    },
                    {
                        description: 'Network Security',
                        id: 'REPORT_SEVERITY_INCIDENT_NETWORK_SECURITY',
                        value: true,
                        hasAccess: false,
                        pageType: 'SeverityNetworkSecurityPage',
                        chartComponents: [
                            {
                                componentName: 'severity-incident-bar',
                                pagePosition: 0,
                                drillDownName: 'Network Security',
                                id: 'REPORT_SEVERITY_TYPE_OF_INCIDENT_NETWORK_BAR_CHART',
                                hasAccess: false
                            },
                            {
                                componentName: 'severity-incident-pie',
                                pagePosition: 1,
                                drillDownName: 'Network Security',
                                id: 'REPORT_SEVERITY_TYPE_OF_INCIDENT_NETWORK_PIE_CHART',
                                hasAccess: false
                            }
                        ]
                    },
                    {
                        description: 'Tech E&O',
                        id: 'REPORT_SEVERITY_INCIDENT_TECH_EO',
                        value: true,
                        hasAccess: false,
                        pageType: 'SeverityTechEOPage',
                        chartComponents: [
                            {
                                componentName: 'severity-incident-bar',
                                pagePosition: 0,
                                drillDownName: 'Tech E&O',
                                id: 'REPORT_SEVERITY_TYPE_OF_INCIDENT_TECH_BAR_CHART',
                                hasAccess: false
                            },
                            {
                                componentName: 'severity-incident-pie',
                                pagePosition: 1,
                                drillDownName: 'Tech E&O',
                                id: 'REPORT_SEVERITY_TYPE_OF_INCIDENT_TECH_PIE_CHART',
                                hasAccess: false
                            }
                        ]
                    },
                    {
                        description: 'Privacy Violations',
                        id: 'REPORT_SEVERITY_INCIDENT_PRIVACY_VIOLATIONS',
                        value: true,
                        hasAccess: false,
                        pageType: 'SeverityPrivacyViolationsPage',
                        chartComponents: [
                            {
                                componentName: 'severity-incident-bar',
                                pagePosition: 0,
                                drillDownName: 'Privacy Violations',
                                id: 'REPORT_SEVERITY_TYPE_OF_INCIDENT_PRIVACY_BAR_CHART',
                                hasAccess: false
                            },
                            {
                                componentName: 'severity-incident-pie',
                                pagePosition: 1,
                                drillDownName: 'Privacy Violations',
                                id: 'REPORT_SEVERITY_TYPE_OF_INCIDENT_PRIVACY_PIE_CHART',
                                hasAccess: false
                            }
                        ]
                    }
                ]
            },
            {
                description: 'Type of Loss',
                id: 'REPORT_SEVERITY_TYPE_OF_LOSS',
                value: true,
                hasAccess: false,
                pageType: 'SeverityTypeOfLossPage',
                chartComponents: [
                    {
                        componentName: 'severity-loss-bar',
                        pagePosition: 0,
                        drillDownName: '',
                        id: 'REPORT_SEVERITY_TYPE_OF_LOSS_BAR_CHART',
                        hasAccess: false
                    },
                    {
                        componentName: 'severity-loss-pie',
                        pagePosition: 1,
                        drillDownName: '',
                        id: 'REPORT_SEVERITY_TYPE_OF_LOSS_PIE_CHART',
                        hasAccess: false
                    }
                ],
                subSubComponents: [
                    {
                        description: 'Personal Information',
                        id: 'REPORT_SEVERITY_LOSS_PERSONAL_INFORMATION',
                        value: true,
                        hasAccess: false,
                        pageType: 'SeverityPersonalInformationPage',
                        chartComponents: [
                            {
                                componentName: 'severity-loss-bar',
                                pagePosition: 0,
                                drillDownName: 'Personal Information',
                                id: 'REPORT_SEVERITY_TYPE_OF_LOSS_PERSONAL_BAR_CHART',
                                hasAccess: false
                            },
                            {
                                componentName: 'severity-loss-pie',
                                pagePosition: 1,
                                drillDownName: 'Personal Information',
                                id: 'REPORT_SEVERITY_TYPE_OF_LOSS_PERSONAL_PIE_CHART',
                                hasAccess: false
                            }
                        ]
                    },
                    {
                        description: 'Corporate Losses',
                        id: 'REPORT_SEVERITY_LOSS_CORPORATE_LOSSES',
                        value: true,
                        hasAccess: false,
                        pageType: 'SeverityCorporateLossesPage',
                        chartComponents: [
                            {
                                componentName: 'severity-loss-bar',
                                pagePosition: 0,
                                drillDownName: 'Corporate Losses',
                                id: 'REPORT_SEVERITY_TYPE_OF_LOSS_CORPORATE_BAR_CHART',
                                hasAccess: false
                            },
                            {
                                componentName: 'severity-loss-pie',
                                pagePosition: 1,
                                drillDownName: 'Corporate Losses',
                                id: 'REPORT_SEVERITY_TYPE_OF_LOSS_CORPORATE_PIE_CHART',
                                hasAccess: false
                            }
                        ]
                    }                    
                ]
            },

            {
                description: 'Top Peer Group Losses',
                id: 'REPORT_SEVERITY_TOP_PEER_GROUP_LOSSES',
                value: true,
                hasAccess: false,
                pageType: 'SeverityTopPeerGroupLossesPage',
                chartComponents: null,
                subSubComponents: null
            },
            {
                description: 'Top Company Losses',
                id: 'REPORT_SEVERITY_TOP_COMPANY_LOSSES',
                value: true,
                hasAccess: false,
                pageType: 'SeverityTopCompanyLossesPage',
                chartComponents: null,
                subSubComponents: null
            },
            {
                description: 'Top Company Hierarchy Losses',
                id: 'REPORT_SEVERITY_MOST_RECENT_HIERARCHY_LOSSES',
                value: true,
                hasAccess: false,
                pageType: 'SeverityTopCompanyHierarchyLossesPage',
                chartComponents: null,
                subSubComponents: null
            }

        ]
    },

    {
        id: 'REPORT_TILE_BENCHMARK',
        description: 'Benchmark',
        value: true,
        hasAccess: false,
        subComponents: [
            {
                description: 'Limit Adequacy',
                id: 'REPORT_BENCHMARK_LIMIT_ADEQUACY',
                value: true,
                hasAccess: false,
                pageType: 'BenchmarkPage',
                chartComponents: [
                    {
                        componentName: 'app-peer-group-loss',
                        pagePosition: 0,
                        drillDownName: '',
                        id: 'REPORT_BENCHMARK_LIMIT_ADEQUACY_CHART',
                        hasAccess: false
                    }
                ],
                subSubComponents: null
            },
            {
                description: 'Premium Distribution',
                id: 'REPORT_BENCHMARK_PREMIUM',
                value: true,
                hasAccess: false,
                pageType: 'BenchmarkPage',
                chartComponents: [
                    {
                        componentName: 'app-premium',
                        pagePosition: 1,
                        drillDownName: '',
                        id: 'REPORT_BENCHMARK_PREMIUM_CHART',
                        hasAccess: false
                    }
                ],
                subSubComponents: null
            },
            {
                description: 'Limit Distribution',
                id: 'REPORT_BENCHMARK_LIMIT',
                value: true,
                hasAccess: false,
                pageType: 'BenchmarkPage',
                chartComponents: [
                    {
                        componentName: 'app-limit',
                        pagePosition: 2,
                        drillDownName: '',
                        id: 'REPORT_BENCHMARK_LIMIT_CHART',
                        hasAccess: false
                    }
                ],
                subSubComponents: null
            },
            {
                description: 'Retention Distribution',
                id: 'REPORT_BENCHMARK_RETENTION',
                value: true,
                hasAccess: false,
                pageType: 'BenchmarkPage',
                chartComponents: [
                    {
                        componentName: 'app-retention',
                        pagePosition: 3,
                        drillDownName: '',
                        id: 'REPORT_BENCHMARK_RETENTION_CHART',
                        hasAccess: false
                    }
                ],
                subSubComponents: null
            },
            {
                description: 'Rate Per Million Distribution by Values',
                id: 'REPORT_BENCHMARK_RATE_PER_MILLION',
                value: true,
                hasAccess: false,
                pageType: 'BenchmarkPage',
                chartComponents: [
                    {
                        componentName: 'app-rate',
                        pagePosition: 4,
                        drillDownName: '',
                        id: 'REPORT_BENCHMARK_RATE_PER_MILLION_CHART',
                        hasAccess: false
                    }
                ],
                subSubComponents: null
            }
        ]
    },

    {
        id: 'REPORT_TILE_APPENDIX',
        description: 'Appendix',
        value: true,
        hasAccess: false,
        subComponents: [
            {
                description: 'Glossary',
                id: 'REPORT_APPENDIX_GLOSSARY',
                value: true,
                hasAccess: false,
                pageType: 'GlossaryPage',
                chartComponents: null,
                subSubComponents: null
            }
        ]
    }

];
