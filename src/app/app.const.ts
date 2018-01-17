export const APPCONSTANTS = {
  SEARCH_SCREEN_NO_RESULT: 'Your search did not match any company. Please refine your search.',
  SESSION_STORAGE_KEYS: {
    SELECTED_COMPANY:                       'Selected_Company',
    SELECTED_SEARCH_CRITERIA:               'Selected_Search_Criteria',
    PEER_GROUP_LOSS:                          'Peer_Group_Loss'
  },
  APPLICATION_ID: 'CYB_OVER_VUE', //will be the product id.
  REPORTS_ID : {
    dashboardPage:                        'REPORT_TILE_DASHBOARD',

    frequencyGauge:                       'REPORT_DASHBOARD_FREQUENCY',
    frequencyGaugeChart:                  'REPORT_DASHBOARD_FREQUENCY_CHART',
    severityGauge:                        'REPORT_DASHBOARD_SEVERITY',
    severityGaugeChart:                   'REPORT_DASHBOARD_SEVERITY_CHART',
    benchmarkGauge:                       'REPORT_DASHBOARD_BENCHMARK',
    benchmarkGaugeChart:                  'REPORT_DASHBOARD_BENCHMARK_CHART',

    frequencyPage:                        'REPORT_TILE_FREQUENCY',

    frequencyIndustry:                    'REPORT_FREQUENCY_INDUSTRY_OVERVIEW',
    frequencyIndustryChart:               'REPORT_FREQUENCY_INDUSTRY_OVERVIEW_CHART',

    frequencyTimePeriod:                  'REPORT_FREQUENCY_TIME_PERIOD',
    frequencyTimePeriodChart:             'REPORT_FREQUENCY_TIME_PERIOD_CHART',
    frequencyTimePeriodDetails:           'REPORT_FREQUENCY_TIME_PERIOD_DETAILS',

    frequencyIncident:                    'REPORT_FREQUENCY_TYPE_OF_INCIDENT',
    frequencyIncidentBarChart:            'REPORT_FREQUENCY_TYPE_OF_INCIDENT_BAR_CHART',
    frequencyIncidentPieChart:            'REPORT_FREQUENCY_TYPE_OF_INCIDENT_PIE_CHART',

    frequencyIncidentDataBarChart:        'REPORT_FREQUENCY_TYPE_OF_INCIDENT_DATA_BAR_CHART',
    frequencyIncidentDataPieChart:        'REPORT_FREQUENCY_TYPE_OF_INCIDENT_DATA_PIE_CHART',
    frequencyIncidentNetworkDataBarChart: 'REPORT_FREQUENCY_TYPE_OF_INCIDENT_NETWORK_BAR_CHART',
    frequencyIncidentNetworkPieChart:     'REPORT_FREQUENCY_TYPE_OF_INCIDENT_NETWORK_PIE_CHART',
    frequencyIncidentTechBarChart:        'REPORT_FREQUENCY_TYPE_OF_INCIDENT_TECH_BAR_CHART',
    frequencyIncidentTechPieChart:        'REPORT_FREQUENCY_TYPE_OF_INCIDENT_TECH_PIE_CHART',
    frequencyIncidentPrivacyBarChart:     'REPORT_FREQUENCY_TYPE_OF_INCIDENT_PRIVACY_BAR_CHART',
    frequencyIncidentPrivacyPieChart:     'REPORT_FREQUENCY_TYPE_OF_INCIDENT_PRIVACY_PIE_CHART',

    frequencyLoss:                        'REPORT_FREQUENCY_TYPE_OF_LOSS',
    frequencyLossBarChart:                'REPORT_FREQUENCY_TYPE_OF_LOSS_BAR_CHART',
    frequencyLossPieChart:                'REPORT_FREQUENCY_TYPE_OF_LOSS_PIE_CHART',

    frequencyLossPersonalBarChart:        'REPORT_FREQUENCY_TYPE_OF_LOSS_PERSONAL_BAR_CHART',
    frequencyLossPersonalPieChart:        'REPORT_FREQUENCY_TYPE_OF_LOSS_PERSONAL_PIE_CHART',
    frequencyLossCorporateBarChart:       'REPORT_FREQUENCY_TYPE_OF_LOSS_CORPORATE_BAR_CHART',
    frequencyLossCorporatePieChart:       'REPORT_FREQUENCY_TYPE_OF_LOSS_CORPORATE_PIE_CHART',

    frequencyPeerLosses:                  'REPORT_FREQUENCY_MOST_RECENT_PEER_GROUP_LOSSES',
    frequencyPeerLossesDetails:           'REPORT_FREQUENCY_MOST_RECENT_PEER_GROUP_LOSSES_DETAILS',
    frequencyCompanyLosses:               'REPORT_FREQUENCY_MOST_RECENT_COMPANY_LOSSES',
    frequencyCompanyLossesDetails:        'REPORT_FREQUENCY_MOST_RECENT_COMPANY_LOSSES_DETAILS',

    severityPage:                         'REPORT_TILE_SEVERITY',

    severityIdustry:                      'REPORT_SEVERITY_INDUSTRY_OVERVIEW',
    severityIdustryChart:                 'REPORT_SEVERITY_INDUSTRY_OVERVIEW_CHART',

    severityTimePeriod:                   'REPORT_SEVERITY_TIME_PERIOD',
    severityTimePeriodChart:              'REPORT_SEVERITY_TIME_PERIOD_CHART',
    severityTimePeriodDetails:            'REPORT_SEVERITY_TIME_PERIOD_DETAILS',

    severityIncident:                     'REPORT_SEVERITY_TYPE_OF_INCIDENT',
    severityIncidentBarChart:             'REPORT_SEVERITY_TYPE_OF_INCIDENT_BAR_CHART',
    severityIncidentPieChart:             'REPORT_SEVERITY_TYPE_OF_INCIDENT_PIE_CHART',

    severityIncidentDataBarChart:         'REPORT_SEVERITY_TYPE_OF_INCIDENT_DATA_BAR_CHART',
    severityIncidentDataPieChart:         'REPORT_SEVERITY_TYPE_OF_INCIDENT_DATA_PIE_CHART',
    severityIncidentNetworkDataBarChart:  'REPORT_SEVERITY_TYPE_OF_INCIDENT_NETWORK_BAR_CHART',
    severityIncidentNetworkPieChart:      'REPORT_SEVERITY_TYPE_OF_INCIDENT_NETWORK_PIE_CHART',
    severityIncidentTechBarChart:         'REPORT_SEVERITY_TYPE_OF_INCIDENT_TECH_BAR_CHART',
    severityIncidentTechPieChart:         'REPORT_SEVERITY_TYPE_OF_INCIDENT_TECH_PIE_CHART',
    severityIncidentPrivacyBarChart:      'REPORT_SEVERITY_TYPE_OF_INCIDENT_PRIVACY_BAR_CHART',
    severityIncidentPrivacyPieChart:      'REPORT_SEVERITY_TYPE_OF_INCIDENT_PRIVACY_PIE_CHART',

    severityLoss:                         'REPORT_SEVERITY_TYPE_OF_LOSS',
    severityLossBarChart:                 'REPORT_SEVERITY_TYPE_OF_LOSS_BAR_CHART',
    severityLossPieChart:                 'REPORT_SEVERITY_TYPE_OF_LOSS_PIE_CHART',

    severityLossPersonalBarChart:         'REPORT_SEVERITY_TYPE_OF_LOSS_PERSONAL_BAR_CHART',
    severityLossPersonalPieChart:         'REPORT_SEVERITY_TYPE_OF_LOSS_PERSONAL_PIE_CHART',
    severityLossCorporateBarChart:        'REPORT_SEVERITY_TYPE_OF_LOSS_CORPORATE_BAR_CHART',
    severityLossCorporatePieChart:        'REPORT_SEVERITY_TYPE_OF_LOSS_CORPORATE_PIE_CHART',

    severityPeerLosses:                   'REPORT_SEVERITY_TOP_PEER_GROUP_LOSSES',
    severityPeerLossesDetails:            'REPORT_SEVERITY_TOP_PEER_GROUP_LOSSES_DETAILS',
    severityCompanyLosses:                'REPORT_SEVERITY_TOP_COMPANY_LOSSES',
    severityCompanyLossesDetails:         'REPORT_SEVERITY_TOP_COMPANY_LOSSES_DETAILS',

    benchmarkPage:                        'REPORT_TILE_BENCHMARK',
    benchmarkLimitAdequacy:               'REPORT_BENCHMARK_LIMIT_ADEQUACY',
    benchmarkLimitAdequacyChart:          'REPORT_BENCHMARK_LIMIT_ADEQUACY_CHART',
    benchmarkPremium:                     'REPORT_BENCHMARK_PREMIUM',
    benchmarkPremiumChart:                'REPORT_BENCHMARK_PREMIUM_CHART',
    benchmarkLimit:                       'REPORT_BENCHMARK_LIMIT',
    benchmarkLimitChart:                  'REPORT_BENCHMARK_LIMIT_CHART',
    benchmarkRetention:                   'REPORT_BENCHMARK_RETENTION',
    benchmarkRetentionChart:              'REPORT_BENCHMARK_RETENTION_CHART',
    benchmarkRate:                        'REPORT_BENCHMARK_RATE_PER_MILLION',
    benchmarkRateChart:                   'REPORT_BENCHMARK_RATE_PER_MILLION_CHART',

    appendixPage:                         'REPORT_TILE_APPENDIX',
    glossary:                             'REPORT_APPENDIX_GLOSSARY'
  }
}
