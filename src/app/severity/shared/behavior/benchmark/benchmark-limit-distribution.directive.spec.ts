import { ComponentFixture } from '@angular/core/testing';
import { BenchmarkLimitDistributionDirective } from './benchmark-limit-distribution.directive';
import { SearchService } from 'app/services/services';

describe('BenchmarkLimitDistributionDirective', () => {
  let fixture: ComponentFixture<SearchService>;
  let searchService = fixture.debugElement.injector.get(SearchService);
  it('should create an instance', () => {
    const directive = new BenchmarkLimitDistributionDirective(searchService);
    expect(directive).toBeTruthy();
  });
});
