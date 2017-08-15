import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BenchmarkRateDistributionDirective } from './benchmark-rate-distribution.directive';
import { SearchService } from '../../services/services';

describe('BenchmarkRateDistributionDirective', () => {
  let fixture: ComponentFixture<SearchService>;
  let searchService = fixture.debugElement.injector.get(SearchService);
  it('should create an instance', () => {
    const directive = new BenchmarkRateDistributionDirective(searchService);
    expect(directive).toBeTruthy();
  });
});
