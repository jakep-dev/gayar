import { FrequencyTimePeriodDirective } from './frequency-time-period.directive';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchService } from './../../../services/services';

describe('FrequencyTimePeriodDirective', () => {
  let fixture: ComponentFixture<SearchService>;
  let searchService = fixture.debugElement.injector.get(SearchService);
  it('should create an instance', () => {
    const directive = new FrequencyTimePeriodDirective(searchService);
    expect(directive).toBeTruthy();
  });
});
