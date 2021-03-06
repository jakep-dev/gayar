export const ServerConstants = {
    COMPANY_SEARCH: { 
        PRODUCT_CODE : 'CYB_SEARCH_PAGE'
    }, DASHBOARD: {
        PRODUCT_CODE :  'CYB_DB_PAGE',
        COMPONENTS_CODE : {
            FREQUENCY:  'CYB_DB_FREQUENCY_GAUGE',
            SEVERITY:   'CYB_DB_SEVERITY_GAUGE',
            BENCHMARK:  'CYB_DB_BENCHMARK_GAUGE'
        }
    }, FREQUENCY: { 
        PRODUCT_CODE : 'CYB_FQ_PAGE',
        COMPONENTS_CODE : {
            INDUSTRY:                       'CYB_FQ_IND_OVERVIEW_CHART',
            TIME_PERIOD:                    'CYB_FQ_TIME_PERIOD_CHART',
            TIME_PERIOD_DETAIL:             'CYB_FQ_TIME_PERIOD_CHART_DETAIL',
            INCIDENT:                       'CYB_FQ_TYPE_OF_INCIDENT_CHART',
            INCIDENT_DETAIL:                'CYB_FQ_TYPE_OF_INCIDENT_CHART_DETAIL',
            LOSS:                           'CYB_FQ_TYPE_OF_LOSS_CHART',
            LOSS_DETAIL:                    'CYB_FQ_TYPE_OF_LOSS_CHART_DETAIL',
            PEER_GROUP_TABLE:               'CYB_FQ_PEERGROUP_LOSS_TABLE',
            PEER_GROUP_TABLE_DESCR:         'CYB_FQ_PEERGROUP_LOSS_TABLE_DESCR',
            COMPANY_TABLE:                  'CYB_FQ_COMPANY_LOSS_DATA_TABLE',
            COMPANY_TABLE_DESCR:            'CYB_FQ_COMPANY_LOSS_DATA_TABLE_DESCR',
            HIERARCHY_LOSS_TABLE:           'CYB_FQ_HIERARCHY_LOSS_TABLE',
            HIERARCHY_LOSS_TABLE_DESCR:     'CYB_FQ_HIERARCHY_LOSS_TABLE_DESCR'
        }
    }, SEVERITY: { 
        PRODUCT_CODE : 'CYB_SV_PAGE',
        COMPONENTS_CODE : {
            INDUSTRY:                       'CYB_SV_INDUSTRY_OVERVIEW_CHART',
            TIME_PERIOD:                    'CYB_SV_TIME_PERIOD_CHART',
            TIME_PERIOD_DETAIL:             'CYB_SV_TIME_PERIOD_CHART_DETAIL',
            INCIDENT:                       'CYB_SV_TYPE_OF_INCIDENT_CHART',
            INCIDENT_DETAIL:                'CYB_SV_TYPE_OF_INCIDENT_CHART_DETAIL',
            LOSS:                           'CYB_SV_TYPE_OF_LOSS_CHART',
            LOSS_DETAIL:                    'CYB_SV_TYPE_OF_LOSS_CHART_DETAIL',
            PEER_GROUP_TABLE:               'CYB_SV_PEER_GROUP_LOSS_TABLE',
            PEER_GROUP_TABLE_DESCR:         'CYB_SV_PEER_GROUP_LOSS_DESCRIPTION',
            COMPANY_TABLE:                  'CYB_SV_COMPANY_LOSS_TABLE',
            COMPANY_TABLE_DESCR:            'CYB_SV_COMPANY_LOSS_DESCRIPTION',
            HIERARCHY_LOSS_TABLE:           'CYB_SV_HIERARCHY_LOSS_TABLE',
            HIERARCHY_LOSS_TABLE_DESCR:     'CYB_SV_HIERARCHY_LOSS_TABLE_DESCR'
        }
    }, BENCHMARK: {
        PRODUCT_CODE :          'CYB_BM_PAGE',
        COMPONENTS_CODE : {
            LIMIT_ADEQUACY :    'CYB_BM_LIMIT_ADEQUACY_CHART',
            PREMIUM:            'CYB_BM_PREMIUM_DIST_CHART',
            LIMIT:              'CYB_BM_LIMIT_DIST_CHART',
            RETENTION:          'CYB_BM_RETENTION_DIST_CHART',
            RATE:               'CYB_BM_RATE_PER_MILLION_CHART'
        }
    }, GLOSSARY: {
        PRODUCT_CODE : 'CYB_GLOSSARY_PAGE'
    }, REPORT : {
        PRODUCT_CODE : 'CYB_REPORT_PAGE'
    }, UNDERWRITING_FRAMEWORK: {
        PRODUCT_CODE: 'P_UNDER_WRITING_FW'
    }

}