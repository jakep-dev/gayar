import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { IReportTileModel } from 'app/model/model';

@Injectable()
export class ReportService {
    constructor() {  }

    getReportConfig () : Observable<Array<IReportTileModel>> {
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
        subComponents: [
            {
                description: 'Frequency',
                id: 'REPORT_DASHBOARD_FREQUENCY',
                value: true,
                pageType: 'DashboardPage',
                chartComponents: [
                    {
                        componentName: 'app-dashboard-frequency',
                        pagePosition: 0,
                        drillDownName: '',
                        viewName: ''
                    }
                ],
                subSubComponents: null
            },
            {
                description: 'Severity',
                id: 'REPORT_DASHBOARD_SEVERITY',
                value: true,
                pageType: 'DashboardPage',
                chartComponents: [
                    {
                        componentName: 'app-dashboard-severity',
                        pagePosition: 1,
                        drillDownName: '',
                        viewName: ''
                    }
                ],
                subSubComponents: null
            },
            {
                description: 'Benchmark',
                id: 'REPORT_DASHBOARD_BENCHMARK',
                value: true,
                pageType: 'DashboardPage',
                chartComponents: [
                    {
                        componentName: 'dashboard-benchmark-score',
                        pagePosition: 2,
                        drillDownName: '',
                        viewName: ''
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
        subComponents: [
            {
                description: 'Industry Overview',
                id: 'REPORT_FREQUENCY_INDUSTRY_OVERVIEW',
                value: true,
                pageType: 'FrequencyIndustryOverviewPage',
                chartComponents: [
                    {
                        componentName: 'frequency-industry-overview',
                        pagePosition: 0,
                        drillDownName: '',
                        viewName: ''
                    }
                ],
                subSubComponents: null
            },
            {
                description: 'Time Period',
                id: 'REPORT_FREQUENCY_TIME_PERIOD',
                value: true,
                pageType: 'FrequencyTimePeriodPage',
                chartComponents: [
                    {
                        componentName: 'frequency-time-period',
                        pagePosition: 0,
                        drillDownName: '',
                        viewName: ''
                    },
                    {
                        componentName: 'frequency-time-period',
                        pagePosition: 1,
                        drillDownName: 'Past 10 years',
                        viewName: ''
                    }
                ],
                subSubComponents: null
            },
            {
                description: 'Type of Incident',
                id: 'REPORT_FREQUENCY_TYPE_OF_INCIDENT',
                value: true,
                pageType: 'FrequencyTypeOfIncidentPage',
                chartComponents: [
                    {
                        componentName: 'frequency-incident-bar',
                        pagePosition: 0,
                        drillDownName: '',
                        viewName: ''
                    },
                    {
                        componentName: 'frequency-incident-pie',
                        pagePosition: 1,
                        drillDownName: '',
                        viewName: ''
                    }
                ],
                subSubComponents: [
                    {
                        description: 'Data Privacy',
                        id: 'REPORT_FREQUENCY_INCIDENT_DATA_PRIVACY',
                        value: true,
                        pageType: 'FrequencyDataPrivacyPage',
                        chartComponents: [
                            {
                                componentName: 'frequency-incident-bar',
                                pagePosition: 0,
                                drillDownName: 'Data Privacy',
                                viewName: ''
                            },
                            {
                                componentName: 'frequency-incident-pie',
                                pagePosition: 1,
                                drillDownName: 'Data Privacy',
                                viewName: ''
                            }
                        ]
                    },
                    {
                        description: 'Network Security',
                        id: 'REPORT_FREQUENCY_INCIDENT_NETWORK_SECURITY',
                        value: true,
                        pageType: 'FrequencyNetworkSecurityPage',
                        chartComponents: [
                            {
                                componentName: 'frequency-incident-bar',
                                pagePosition: 0,
                                drillDownName: 'Network Security',
                                viewName: ''
                            },
                            {
                                componentName: 'frequency-incident-pie',
                                pagePosition: 1,
                                drillDownName: 'Network Security',
                                viewName: ''
                            }
                        ]
                    },
                    {
                        description: 'Tech E&O',
                        id: 'REPORT_FREQUENCY_INCIDENT_TECH_EO',
                        value: true,
                        pageType: 'FrequencyTechEOPage',
                        chartComponents: [
                            {
                                componentName: 'frequency-incident-bar',
                                pagePosition: 0,
                                drillDownName: 'Tech E&O',
                                viewName: ''
                            },
                            {
                                componentName: 'frequency-incident-pie',
                                pagePosition: 1,
                                drillDownName: 'Tech E&O',
                                viewName: ''
                            }
                        ]
                    },
                    {
                        description: 'Privacy Violations',
                        id: 'REPORT_FREQUENCY_INCIDENT_PRIVACY_VIOLATIONS',
                        value: true,
                        pageType: 'FrequencyPrivacyViolationsPage',
                        chartComponents: [
                            {
                                componentName: 'frequency-incident-bar',
                                pagePosition: 0,
                                drillDownName: 'Privacy Violations',
                                viewName: ''
                            },
                            {
                                componentName: 'frequency-incident-pie',
                                pagePosition: 1,
                                drillDownName: 'Privacy Violations',
                                viewName: ''
                            }
                        ]
                    }
                ]
            },
            {
                description: 'Type of Loss',
                id: 'REPORT_FREQUENCY_TYPE_OF_LOSS',
                value: true,
                pageType: 'FrequencyTypeOfLossPage',
                chartComponents: [
                    {
                        componentName: 'frequency-loss-bar',
                        pagePosition: 0,
                        drillDownName: '',
                        viewName: ''
                    },
                    {
                        componentName: 'frequency-loss-pie',
                        pagePosition: 1,
                        drillDownName: '',
                        viewName: ''
                    }
                ],
                subSubComponents: [
                    {
                        description: 'Personal Information',
                        id: 'REPORT_FREQUENCY_LOSS_PERSONAL_INFORMATION',
                        value: true,
                        pageType: 'FrequencyPersonalInformationPage',
                        chartComponents: [
                            {
                                componentName: 'frequency-loss-bar',
                                pagePosition: 0,
                                drillDownName: 'Personal Information',
                                viewName: ''
                            },
                            {
                                componentName: 'frequency-loss-pie',
                                pagePosition: 1,
                                drillDownName: 'Personal Information',
                                viewName: ''
                            }
                        ]
                    },
                    {
                        description: 'Corporate Losses',
                        id: 'REPORT_FREQUENCY_LOSS_CORPORATE_LOSSES',
                        value: true,
                        pageType: 'FrequencyCorporateLossesPage',
                        chartComponents: [
                            {
                                componentName: 'frequency-loss-bar',
                                pagePosition: 0,
                                drillDownName: 'Corporate Losses',
                                viewName: ''
                            },
                            {
                                componentName: 'frequency-loss-pie',
                                pagePosition: 1,
                                drillDownName: 'Corporate Losses',
                                viewName: ''
                            }
                        ]
                    }
                ]
            }
        ]
    },

    {
        id: 'REPORT_TILE_SEVERITY',
        description: 'Severity',
        value: true,
        subComponents: [
            {
                description: 'Industry Overview',
                id: 'REPORT_SEVERITY_INDUSTRY_OVERVIEW',
                value: true,
                pageType: 'SeverityIndustryOverviewPage',
                chartComponents: [
                    {
                        componentName: 'severity-industry-overview',
                        pagePosition: 0,
                        drillDownName: '',
                        viewName: ''
                    }
                ],
                subSubComponents: null
            },
            {
                description: 'Time Period',
                id: 'REPORT_SEVERITY_TIME_PERIOD',
                value: true,
                pageType: 'SeverityTimePeriodPage',
                chartComponents: [
                    {
                        componentName: 'severity-time-period',
                        pagePosition: 0,
                        drillDownName: '',
                        viewName: ''
                    },
                    {
                        componentName: 'severity-time-period',
                        pagePosition: 1,
                        drillDownName: 'Past 10 years',
                        viewName: ''
                    }
                ],
                subSubComponents: null
            },
            {
                description: 'Type of Incident',
                id: 'REPORT_SEVERITY_TYPE_OF_INCIDENT',
                value: true,
                pageType: 'SeverityTypeOfIncidentPage',
                chartComponents: [
                    {
                        componentName: 'severity-incident-bar',
                        pagePosition: 0,
                        drillDownName: '',
                        viewName: ''
                    },
                    {
                        componentName: 'severity-incident-pie',
                        pagePosition: 1,
                        drillDownName: '',
                        viewName: ''
                    }
                ],
                subSubComponents: [
                    {
                        description: 'Data Privacy',
                        id: 'REPORT_SEVERITY_INCIDENT_DATA_PRIVACY',
                        value: true,
                        pageType: 'SeverityDataPrivacyPage',
                        chartComponents: [
                            {
                                componentName: 'severity-incident-bar',
                                pagePosition: 0,
                                drillDownName: 'Data Privacy',
                                viewName: ''
                            },
                            {
                                componentName: 'severity-incident-pie',
                                pagePosition: 1,
                                drillDownName: 'Data Privacy',
                                viewName: ''
                            }
                        ]
                    },
                    {
                        description: 'Network Security',
                        id: 'REPORT_SEVERITY_INCIDENT_NETWORK_SECURITY',
                        value: true,
                        pageType: 'SeverityNetworkSecurityPage',
                        chartComponents: [
                            {
                                componentName: 'severity-incident-bar',
                                pagePosition: 0,
                                drillDownName: 'Network Security',
                                viewName: ''
                            },
                            {
                                componentName: 'severity-incident-pie',
                                pagePosition: 1,
                                drillDownName: 'Network Security',
                                viewName: ''
                            }
                        ]
                    },
                    {
                        description: 'Tech E&O',
                        id: 'REPORT_SEVERITY_INCIDENT_TECH_EO',
                        value: true,
                        pageType: 'SeverityTechEOPage',
                        chartComponents: [
                            {
                                componentName: 'severity-incident-bar',
                                pagePosition: 0,
                                drillDownName: 'Tech E&O',
                                viewName: ''
                            },
                            {
                                componentName: 'severity-incident-pie',
                                pagePosition: 1,
                                drillDownName: 'Tech E&O',
                                viewName: ''
                            }
                        ]
                    },
                    {
                        description: 'Privacy Violations',
                        id: 'REPORT_SEVERITY_INCIDENT_PRIVACY_VIOLATIONS',
                        value: true,
                        pageType: 'SeverityPrivacyViolationsPage',
                        chartComponents: [
                            {
                                componentName: 'severity-incident-bar',
                                pagePosition: 0,
                                drillDownName: 'Privacy Violations',
                                viewName: ''
                            },
                            {
                                componentName: 'severity-incident-pie',
                                pagePosition: 1,
                                drillDownName: 'Privacy Violations',
                                viewName: ''
                            }
                        ]
                    }
                ]
            },
            {
                description: 'Type of Loss',
                id: 'REPORT_SEVERITY_TYPE_OF_LOSS',
                value: true,
                pageType: 'SeverityTypeOfLossPage',
                chartComponents: [
                    {
                        componentName: 'severity-loss-bar',
                        pagePosition: 0,
                        drillDownName: '',
                        viewName: ''
                    },
                    {
                        componentName: 'severity-loss-pie',
                        pagePosition: 1,
                        drillDownName: '',
                        viewName: ''
                    }
                ],
                subSubComponents: [
                    {
                        description: 'Personal Information',
                        id: 'REPORT_SEVERITY_LOSS_PERSONAL_INFORMATION',
                        value: true,
                        pageType: 'SeverityPersonalInformationPage',
                        chartComponents: [
                            {
                                componentName: 'severity-loss-bar',
                                pagePosition: 0,
                                drillDownName: 'Personal Information',
                                viewName: ''
                            },
                            {
                                componentName: 'severity-loss-pie',
                                pagePosition: 1,
                                drillDownName: 'Personal Information',
                                viewName: ''
                            }
                        ]
                    },
                    {
                        description: 'Corporate Losses',
                        id: 'REPORT_SEVERITY_LOSS_CORPORATE_LOSSES',
                        value: true,
                        pageType: 'SeverityCorporateLossesPage',
                        chartComponents: [
                            {
                                componentName: 'severity-loss-bar',
                                pagePosition: 0,
                                drillDownName: 'Corporate Losses',
                                viewName: ''
                            },
                            {
                                componentName: 'severity-loss-pie',
                                pagePosition: 1,
                                drillDownName: 'Corporate Losses',
                                viewName: ''
                            }
                        ]
                    }                    
                ]
            }
        ]
    },

    {
        id: 'REPORT_TILE_BENCHMARK',
        description: 'Benchmark',
        value: true,
        subComponents: [
            {
                description: 'Limit Adequacy',
                id: 'REPORT_BENCHMARK_LIMIT_ADEQUACY',
                value: true,
                pageType: 'BenchmarkPage',
                chartComponents: [
                    {
                        componentName: 'app-peer-group-loss',
                        pagePosition: 0,
                        drillDownName: '',
                        viewName: ''
                    }
                ],
                subSubComponents: null
            },
            {
                description: 'Premium Distribution by Counts',
                id: 'REPORT_BENCHMARK_PREMIUM',
                value: true,
                pageType: 'BenchmarkPage',
                chartComponents: [
                    {
                        componentName: 'app-premium',
                        pagePosition: 1,
                        drillDownName: '',
                        viewName: ''
                    }
                ],
                subSubComponents: null
            },
            {
                description: 'Limit Distribution by Counts',
                id: 'REPORT_BENCHMARK_LIMIT',
                value: true,
                pageType: 'BenchmarkPage',
                chartComponents: [
                    {
                        componentName: 'app-limit',
                        pagePosition: 2,
                        drillDownName: '',
                        viewName: ''
                    }
                ],
                subSubComponents: null
            },
            {
                description: 'Retention Distribution by Counts',
                id: 'REPORT_BENCHMARK_RETENTION',
                value: true,
                pageType: 'BenchmarkPage',
                chartComponents: [
                    {
                        componentName: 'app-retention',
                        pagePosition: 3,
                        drillDownName: '',
                        viewName: ''
                    }
                ],
                subSubComponents: null
            },
            {
                description: 'Rate Per Million Distribution by Values',
                id: 'REPORT_BENCHMARK_RATE_PER_MILLION',
                value: true,
                pageType: 'BenchmarkPage',
                chartComponents: [
                    {
                        componentName: 'app-rate',
                        pagePosition: 4,
                        drillDownName: '',
                        viewName: ''
                    }
                ],
                subSubComponents: null
            }
        ]
    }

];
