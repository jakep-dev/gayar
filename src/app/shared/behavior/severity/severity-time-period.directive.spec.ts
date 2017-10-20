import { SeverityTimePeriodDirective } from './severity-time-period.directive';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchService } from './../../../services/services';

describe('SeverityTimePeriodDirective', () => {
	let fixture: ComponentFixture<SearchService>;
	let searchService = fixture.debugElement.injector.get(SearchService);
	it('should create an instance', () => {
		const directive = new SeverityTimePeriodDirective(searchService);
		expect(directive).toBeTruthy();
	});
});
