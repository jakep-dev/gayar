import { BaseChart } from '../../charts/base-chart';
import { BarChartData } from 'app/model/charts/bar-chart.model';
import { Directive, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { SeverityTimePeriodModel, SeverityTimePeriodGroup, ComponentPrintSettings } from "app/model/model";
import { SearchService, SessionService, FormatService } from 'app/services/services';

@Directive({
	selector: '[severity-time-period]'
})

export class SeverityTimePeriodDirective {

	@Input() modelData: SeverityTimePeriodModel;

	@Output() onDataComplete = new EventEmitter<BarChartData>();

	@Input() chartComponent: BaseChart;

	@Input() public printSettings: ComponentPrintSettings;

	ngOnChanges(changes: SimpleChanges) { }

	public static defaultLineColor: string = 'black';
	hasDetailAccess: boolean;
	seriesColor: string[];
	displayText: string = '';
	companyName: string = '';

	constructor(private searchService: SearchService, private sessionService: SessionService, private formatService: FormatService) {
		this.seriesColor = [];
		this.seriesColor["Company"] = '#F68C20';
		this.seriesColor["Peer"] = '#487AA1';
	}

	private getSeriesColor(seriesName: string) {
		return this.seriesColor[seriesName] || SeverityTimePeriodDirective.defaultLineColor;
	}

	ngOnInit() {
		this.getCompanyName();
		this.buildHighChartObject();
	}

	getCompanyName() {
		if (this.searchService.searchCriteria &&
			this.searchService.searchCriteria.type &&
			this.searchService.searchCriteria.type !== 'SEARCH_BY_MANUAL_INPUT' &&
			this.searchService.selectedCompany &&
			this.searchService.selectedCompany.companyName) {
			this.companyName = this.searchService.selectedCompany.companyName;
		} else if (this.searchService.searchCriteria && this.searchService.searchCriteria.value) {
			this.companyName = this.searchService.searchCriteria.value;
		}
	}

	getSeriesObject(groupName) {
		switch (groupName) {
			case 'Peer':
				return {
					name: 'Peer Group',
					id: '',
					type: 'column',
					color: this.seriesColor[groupName],
					data: []
				}
			case 'Company':
				return {
					name: this.companyName,
					id: '',
					type: 'scatter',
					pointPadding: 0.2,
					color: this.seriesColor[groupName],
					marker: {
						symbol: 'circle',
					},
					data: []
				}
			default: break;
		}
	}

	/**
	 * Use chart data from web service to build parts of Highchart chart options object
	 */
	buildHighChartObject() {
		this.getDetailAccess();
		this.buildNoBreakChart();
	}

	getDetailAccess() {
        let permission = this.sessionService.getUserPermission();
        this.hasDetailAccess = permission && permission.severity && permission.severity.timePeriod && permission.severity.timePeriod.hasDetailAccess;
    }

	buildNoBreakChart() {

		let legendYOffset: number;
        let marginBottom: number;
        let spacingBottom: number;
        if(this.printSettings) {
            legendYOffset = 0;
            marginBottom = 120;
            spacingBottom = 45;
        } else {
            legendYOffset = 0;
            marginBottom = 140;
            spacingBottom = 70;
		}
		var formatService = this.formatService;
		let tempChartData: BarChartData = {
			series: [],
			title: this.modelData.chartTitle,
			subtitle: this.modelData.filterDescription,
			displayText: this.modelData.displayText,
			categories: null,
			xAxisLabel: this.modelData.xAxis,
			yAxisLabel: this.modelData.yAxis,
			xAxisFormatter: null,
			drilldown: [],
			drillUpText: '<span style="font-size:9px">  Back to All Time </span><br/>' +
			'<span style="font-size:9px"> Periods</span>',
			onDrillDown: null,
			onDrillUp: null,
			customChartSettings: {
				chart: {
					marginLeft: this.getMarginLeft(),
					marginTop: 80,
					marginBottom: marginBottom,
                    spacingBottom: spacingBottom
				},
				title: {
					text: (this.modelData.datasets && this.modelData.datasets.length > 0) ? this.modelData.xAxis : '',
					style: {
						fontWeight: 'normal',
						fontSize: '11px'
					},
					align: 'center',
                    verticalAlign: 'bottom',
                    y: -30
				},
				subtitle: {
					y: 15
				},
				xAxis: {
					type: 'category',
					categories: null,
					title: {
						style: {
							fontWeight: 'bold',
							fontSize: '11px',
							color: 'transparent',
						}
					},
					labels: {
						rotation: 0,
						step: 1
					},
					tickWidth: 0,
					lineWidth: 2,
				},
				yAxis: [
                    {
                        type:'logarithmic',
                        breaks: [{
                            from: -0.125,
                            to: 1,
                            breakSize:1
                        }],
                        gridLineWidth: 0,  
                        tickWidth:0,
                        lineWidth: 2,
						tickPositioner: function() {
							let maxLog = Math.ceil(Math.log10(this.dataMax));
                            let tickPosition = [-0.9, -0.01, 1];
					
							for (let index = 1; index < maxLog; index++) {
								tickPosition.push(index + 1);
							}
							return tickPosition;
						},
                        labels: {
                            format: '{value:,.0f}',
                            formatter: function() {
								return formatService.tooltipFormatter(this.value.toFixed());
                            }
                        },
                        title: {
                            text: '<div style="text-align:center;width:180px;margin:0 auto;">'+ this.modelData.yAxis +'</div>',
                            useHTML: true,
                            style:{
                                fontSize: '11px'
                            }
                        },
                        offset:-0.125        
                    }
                ],
				legend: {
					enabled: true,
					symbolHeight: 8,
					y: legendYOffset
				},
				tooltip: {
                    shared: false,
                    formatter: function () {
						let value = formatService.tooltipFormatter(this.point.y);
                        return '<span style="font-size:11px">' + this.series.name + '</span><br>' +
                            '<span style="color:' + this.point.color + '">' + this.point.name + '</span>: <b>' + value + '</b><br/>';
                    }
				},
				plotOptions: {
					scatter: {
                        enableMouseTracking: true,
                        stickyTracking:false
                    },
                    column:{
                        enableMouseTracking: true,
                        stickyTracking:false
                    },
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: false,
                        },
                        marker: {
                            enabled: true,
                            radius: 5
                        }
                    }
				},
				drilldown: {
					activeAxisLabelStyle: {
						textDecoration: 'none',
						color: '#464646',
						'font-weight': 'normal'
					},
					drillUpButton: {
						relativeTo: 'spacingBox',
						position: {
							y: 20,
							x: 0,
						},
						theme: {
							fill: 'white',
							'stroke-width': 1,
							stroke: 'silver',
							r: 0,
							display: 'hidden',
							states: {
								hover: {
									fill: '#F68C20'
								},
								select: {
									stroke: '#487AA1',
									fill: '#F68C20'
								}
							}
						}
					}
				}
			},
			hasRedrawActions: true
		};
		this.displayText = this.modelData.displayText;

		let groups: SeverityTimePeriodGroup[] = new Array();
		let groupNames = new Array();
		let groupDrilldownNames = new Array();
		let series = {};
		var defaultTitle = this.modelData.xAxis;

		this.modelData.datasets.forEach(eachData => {
			if (!groupNames.join(',').includes(eachData.compOrPeer)) {
				groupNames.push(eachData.compOrPeer);
			}
		});

		groupNames.sort().reverse().forEach(name => {
			let mainGroup = this.modelData.datasets.filter(
				eachGroup => eachGroup.compOrPeer === name && eachGroup.ruleTypeCode === 'TPS' &&
					!(eachGroup.compOrPeer === 'Company' && eachGroup.count <= 0)
			);

			if (mainGroup && mainGroup.length > 0) {
				let series = this.getSeriesObject(name);
				series.data = mainGroup.map(eachGroup => {
					return {
						name: eachGroup.period,
						drilldown: ( (!this.hasDetailAccess) || eachGroup.compOrPeer === 'Company' || eachGroup.count <= 0) ? null : eachGroup.period,
						y: eachGroup.count
					}
				});
				tempChartData.series.push(series);

				mainGroup.forEach(eachMainGroup => {
					let detailedGroup = this.modelData.datasets.filter(
						eachGroup => eachGroup.compOrPeer === name &&
							eachGroup.ruleTypeCode === 'TPC' &&
							eachGroup.ruleTypeSubCode < eachMainGroup.ruleTypeSubCode &&
							!(eachGroup.compOrPeer === 'Company' && eachGroup.count < 1)
					);

					if (detailedGroup && detailedGroup.length > 0) {
						detailedGroup = detailedGroup.sort(eachGroup => Number(eachGroup.period));
						let series = this.getSeriesObject(name);
						series.id = eachMainGroup.period;
						series.data = detailedGroup.map(group => {
							return [
								group.period, group.count
							];
						});
						tempChartData.drilldown.push(series);
					}
				});
			}
		});

		tempChartData.onDrillDown = function (event, chart) {
			var e = event.originalEvent;
			var drilldowns = tempChartData.drilldown;

			e.preventDefault();
			drilldowns.forEach(function (p, i) {
				if (p.id.includes(e.point.name)) {
					chart.addSingleSeriesAsDrilldown(e.point, p);
					chart.setTitle({ text: 'Year' });
				}

			});
			chart.applyDrilldown();
		};

		tempChartData.onDrillUp = function (event, chart) {
			chart.setTitle({ text: defaultTitle });
		}

        if(this.modelData.maxValue === 0) {
            tempChartData.title = '';
            tempChartData.subtitle = '';
            tempChartData.customChartSettings.subtitle.text = '';
            tempChartData.customChartSettings.title.text = '';
            tempChartData.series = [];
            tempChartData.drilldown = [];
		}
		
		this.onDataComplete.emit(tempChartData);

	}

	getMarginLeft() {
        let maxValue = this.modelData.maxValue;
        let maxCharactersLength:number = maxValue.toFixed(0).toString().length + 1;       
        let marginLeft = 60 + (maxCharactersLength * 8);
        
        return marginLeft;
    }
}
