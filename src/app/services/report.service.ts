import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { IReportTileModel, IGlossaryTermModel, ISubGlossaryTermModel } from 'app/model/model';

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

    public getReportGlossaryConfig () : Observable<Array<IGlossaryTermModel>> {
        let subject = new Subject<Array<IGlossaryTermModel>>();
        try {
            setTimeout(() => {
                subject.next(GLOSSARY_CONFIGURATION);
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
            },

            {
                description: 'Most Recent Peer Group Losses',
                id: 'REPORT_FREQUENCY_MOST_RECENT_PEER_GROUP_LOSSES',
                value: true,
                pageType: 'FrequencyMostRecentPeerGroupLossesPage',
                chartComponents: null,
                subSubComponents: null
            },
            {
                description: 'Most Recent Company Losses',
                id: 'REPORT_FREQUENCY_MOST_RECENT_COMPANY_LOSSES',
                value: true,
                pageType: 'FrequencyMostRecentCompanyLossesPage',
                chartComponents: null,
                subSubComponents: null
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
            },

            {
                description: 'Top Peer Group Losses',
                id: 'REPORT_SEVERITY_TOP_PEER_GROUP_LOSSES',
                value: true,
                pageType: 'SeverityTopPeerGroupLossesPage',
                chartComponents: null,
                subSubComponents: null
            },
            {
                description: 'Top Company Losses',
                id: 'REPORT_SEVERITY_TOP_COMPANY_LOSSES',
                value: true,
                pageType: 'SeverityTopCompanyLossesPage',
                chartComponents: null,
                subSubComponents: null
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
    },

    {
        id: 'REPORT_TILE_APPENDIX',
        description: 'Appendix',
        value: true,
        subComponents: [
            {
                description: 'Glossary',
                id: 'REPORT_APPENDIX_GLOSSARY',
                value: true,
                pageType: 'GlossaryPage',
                chartComponents: null,
                subSubComponents: null
            }
        ]
    }

];

const GLOSSARY_CONFIGURATION: Array<IGlossaryTermModel> = [
    {
        id: 'GLOSSARY_TERM_ACCIDENT_DATE',
        term: "Accident Date",
        definition: "Date on which the incident occurred or began.",
        subComponents: null,
        list: null
    },
    {
        id: 'GLOSSARY_TERM_AFFECTED_COUNT',
        term: "Affected Count",
        definition: "Refers to the number of individuals or systems affected. These could be based on the number of identities breached or stolen, social security numbers revealed, devices compromised, etc., depending on type of incident.",
        subComponents: null,
        list: null
    },
    {
        id: 'GLOSSARY_TERM_BENCHMARKING_ANALYSIS',
        term: "Benchmarking Analysis",
        definition: "Analyses that give insight on how an organization’s program compares to its peers.",
        subComponents: null,
        list: null
    },
    {
        id: 'GLOSSARY_TERM_CASE_TYPE_FAMILIES',
        term: "Case Type Families",
        definition: "Groupings of multiple case types that share similar characteristics.  These include:",
        subComponents: [
            {
                id: 'GLOSSARY_SUBTERM_DATA_PRIVACY',
                term: "Data Privacy",
                definition: "A grouping of case types that deal with situations where there has been an unauthorized breach or disclosure of personal information of some sort.",
                list: null
            },
            {
                id: 'GLOSSARY_SUBTERM_NETWORK_SECURITY',
                term: "Network Security",
                definition: "A grouping of case types that deal with situations involving the disruption or interference of corporate operations.",
                list: null
            },
            {
                id: 'GLOSSARY_SUBTERM_TECH_E_O',
                term: "Tech E&O",
                definition: "A grouping of case types that deal with situations involving the failure of corporate operations resulting from errors or oversights in the development, implementation, and/or maintenance of the organizations’ IT environment.",
                list: null
            },
            {
                id: 'GLOSSARY_SUBTERM_PRIVACY_VIOLATIONS',
                term: "Privacy Violations",
                definition: "A grouping of case types that deal with situations involving individual or corporate privacy, and frequently involves the violation of various laws and regulations dealing with the collection  and disclosure of information to a third party, or contacting an individual or company without their permission.",
                list: null
            }
        ],
        list: null
    },
    {
        id: 'GLOSSARY_TERM_CASE_TYPE',
        term: "Case Type",
        definition: "The type of cyber incident based on a number of characteristics. Advisen captures 13 different case types, which are defined below.",
        subComponents: null,
        list: null
    },
    {
        id: 'GLOSSARY_TERM_DATA_PRIVACY',
        term: "Data Privacy",
        definition: "A grouping of case types that deal with situations where there has been an unauthorized breach or disclosure of personal information of some sort. These case types are as follows:",
        subComponents: [
            {
                id: 'GLOSSARY_SUBTERM_DATA_MALICIOUS_BREACH',
                term: "Data – Malicious Breach",
                definition: "Situations where personal confidential information or digital assets either has been or may have been exposed or stolen, by unauthorized internal or external actors whose intent appears to have been the acquisition of such information.",
                list: null
            },
            {
                id: 'GLOSSARY_SUBTERM_DATA_UNINTENTIONAL_DISCLOSURE',
                term: "Data – Unintentional Disclosure",
                definition: "Situations where personal confidential information or digital assets have either been exposed, or may have been exposed, to unauthorized viewers due to an unintentional or inadvertent accident or error.",
                list: null
            },
            {
                id: 'GLOSSARY_SUBTERM_DATA_PHYSICALLY_LOST_STOLEN',
                term: "Data Physically Lost or Stolen",
                definition: "Situations where personal confidential information or digital assets have been included, or may have been included, with computer or peripheral equipment which has been lost, stolen, or improperly disposed of; the confidential information is incidentally included but unlikely to be the primary focus.",
                list: null
            },
            {
                id: 'GLOSSARY_SUBTERM_PHISHING_SPOOFING_SOCIAL_ENGINEERING',
                term: "Phishing, Spoofing, Social Engineering",
                definition: "Attempts to get individuals to voluntarily provide information which could then be used illicitly, e.g. phishing or spoofing a legitimate website with a close replica to obtain account information.",
                list: null
            },
            {
                id: 'GLOSSARY_SUBTERM_SKIMMING_PHYSICAL_TAMPERING',
                term: "Skimming Physical Tampering",
                definition: "Use of physical devices to illegally capture electronic information such as bank account or credit card numbers for individual transactions.",
                list: null
            },
            {
                id: 'GLOSSARY_TERM_IDENTITY_FRADULENT_USE_ACCOUNT_ACCESS',
                term: "Identity - Fraudulent Use / Account Access",
                definition: "Actual identity theft or the fraudulent use of confidential personal information or account access.",
                list: null
            }
        ],
        list: null
    },
    {
        id: 'GLOSSARY_TERM_NETWORK_SECURITY',
        term: "Network Security",
        definition: "A grouping of case types that deal with situations involving the disruption or interference of corporate operations. These case types are as follows:",
        subComponents: [
            {
                id: 'GLOSSARY_SUBTERM_NETWORK_WEBSITE_DISRUPTION',
                term: "Network / Website Disruptions",
                definition: "Unauthorized use of or access to a computer or network, or interference with the operation of same, including virus, worm, malware, digital denial of service (DDOS), etc.",
                list: null
            },
            {
                id: 'GLOSSARY_SUBTERM_CYBER_EXTORTION',
                term: "Cyber Extortion",
                definition: "Threats to fraudulently transfer funds, destroy data, interfere with the operation of a system/network/site, or disclose confidential digital information such as identities of customers/employees, unless payments are made",
                list: null
            },
            {
                id: 'GLOSSARY_SUBTERM_INDUSTRIAL_CONTROLS_OPERATIONS',
                term: "Industrial Controls & Operations",
                definition: "Losses involving disruption or attempted disruption  to “connected” physical assets such as factories, automobiles, power plants, electrical grids, etc. (including “the internet of things”)",
                list: null
            }
        ],
        list: null
    },
    {
        id: 'GLOSSARY_TERM_TECH_E_O',
        term: "Tech E&O",
        definition: "A grouping of case types that deal with situations involving the failure of corporate operations resulting from errors or oversights in the development, implementation, and/or maintenance of the organizations’ IT environment. These case types are as follows:",
        subComponents: [
            {
                id: 'GLOSSARY_SUBTERM_IT_PROCESSING_ERRORS',
                term: "IT – Processing Errors",
                definition: "Losses resulting from internal errors in electronically processing orders, purchases, registrations, etc., usually due to a security or authorization inadequacy, software bug, hardware malfunction, or user error.",
                list: null
            },
            {
                id: 'GLOSSARY_SUBTERM_IT_CONFIGURATION_IMPLEMENTATION_ERRORS',
                term: "IT – Configuration / Implementation Errors",
                definition: "Losses resulting from errors or mistakes which are made in maintaining, upgrading, replacing, or operating the hardware and software IT infrastructure of an organization, typically resulting in system, network, or web outages or disruptions",
                list: null
            }
        ],
        list: null
    },
    {
        id: 'GLOSSARY_TERM_PRIVACY_VIOLATIONS',
        term: "Privacy Violations",
        definition: "A grouping of case types that deal with situations involving individual or corporate privacy, and frequently involves the violation of various laws and regulations dealing with the collection  and disclosure of information to a third party, or contacting an individual or company without their permission. These case types are as follows:",
        subComponents: [
            {
                id: 'GLOSSARY_SUBTERM_PRIVACY_UNAUTHORIZED_DATA_COLLECTION',
                term: "Privacy – Unauthorized Data Collection",
                definition: "Cases where information about the users of electronic services, such as social media, cellphones, websites, etc. is captured and stored without their knowledge or consent",
                list: null
            },
            {
                id: 'GLOSSARY_SUBTERM_PRIVACY_UNAUTHORIZED_CONTACT_DISCLOSURE',
                term: "Privacy – Unauthorized Contact or Disclosure",
                definition: "Cases when personal information is used in an unauthorized manner to contact or publicize information regarding an individual or an organization without their explicit permission",
                list: null
            }
        ],
        list: null
    },
    {
        id: 'GLOSSARY_TERM_COMPANY_LOSS_PROFILE',
        term: "Company Loss Profile",
        definition: "The historical loss experience for the selected company. In general, this is indicated by the orange dots in the various charts.",
        subComponents: null,
        list: null
    },
    {
        id: 'GLOSSARY_TERM_PEER_GROUP_LOSS_PROFILE',
        term: "Peer Group Loss Profile",
        definition: "The historical loss experience for the peer group of the selected company. In general, this is indicated by the blue bars in the various charts.",
        subComponents: null,
        list: null
    },
    {
        id: 'GLOSSARY_TERM_FREQUENCY_ANALYSIS',
        term: "Frequency Analysis",
        definition: "Analyses based on the number of cyber incidents experience over a given time period.",
        subComponents: null,
        list: null
    },
    {
        id: 'GLOSSARY_TERM_TYPE_OF_LOSS',
        term: "Type of Loss",
        definition: "The type of data, asset, or information that was compromised during a cyber incident. The two main groups are as follows:",
        subComponents: null,
        list: null
    },
    {
        id: 'GLOSSARY_TERM_PERSONAL_INFORMATION',
        term: "Personal Information",
        definition: "A grouping of types of loss that relate to the compromise of personal information. These include:",
        subComponents: [
            {
                id: 'GLOSSARY_SUBTERM_PERSONAL_IDENTIFIABLE_INFORMATION',
                term: "Personal Identifiable Information",
                definition: "Data containing identifying information, including name, address, e-mail, date of birth, gender etc.",
                list: null
            },
            {
                id: 'GLOSSARY_SUBTERM_PERSONAL_HEALTH_INFORMATION',
                term: "Personal Health Information",
                definition: "Data specifically protected under health information laws and regulations (such as HIPAA), including medical records and health information",
                list: null
            },
            {
                id: 'GLOSSARY_SUBTERM_PERSONAL_FINANCIAL_INFORMATION',
                term: "Personal Financial Information",
                definition: "Credit/debit card details, social security numbers, banking financial records (account numbers, routing numbers, etc.)",
                list: null
            }
        ],
        list: null
    },
    {
        id: 'GLOSSARY_TERM_CORPORATE_LOSSES',
        term: "Corporate Losses",
        definition: "A grouping of types of loss that relate to the compromise of corporate data or assets. These include:",
        subComponents: [
            {
                id: 'GLOSSARY_SUBTERM_LOSS_OF_BUSINESS_INCOME_SERVICES',
                term: "Loss of Business Income / Services",
                definition: "Any interruption of normal business activities as a result of a cyber incident. These could be a consequence of Distributed Denial of Service (DDoS) attacks or reputational damage.",
                list: null
            },
            {
                id: 'GLOSSARY_SUBTERM_LOSS_OF_DIGITAL_ASSETS',
                term: "Loss of Digital Assets",
                definition: "Business and customer data, trade secrets, proprietary software and other confidential corporate data.",
                list: null
            },
            {
                id: 'GLOSSARY_SUBTERM_LOSS_OF_FINANCIAL_ASSETS',
                term: "Loss of Financial Assets",
                definition: "Money, securities and other financial property, including digital currency such as Bitcoins that belong to either the company or its clients.",
                list: null
            }
        ],
        list: null
    },
    {
        id: 'GLOSSARY_TERM_PEER_GROUP',
        term: "Peer Group",
        definition: "A grouping of companies that share the same industry grouping (2 digit NAICS) and revenue range as the selected company.",
        subComponents: null,
        list: null
    },
    {
        id: 'GLOSSARY_TERM_REVENUE_BANDS',
        term: "Revenue Bands",
        definition: "Company revenue in USD. The following bands have been identified and are consistently applied across all industries:<list\>",
        subComponents: null,
        list: [
            "Less than $25M",
            "$25M to < $100M",
            "$100M to < $250M",
            "$250M to < $500M",
            "$500M to < $1B",
            "$1B to Greater"
        ]
    },
    {
        id: 'GLOSSARY_TERM_SEVERITY_ANALYSIS',
        term: "Severity Analysis",
        definition: "Analyses based on the number of records affected during cyber incidents over a given time period",
        subComponents: null,
        list: null
    }
];