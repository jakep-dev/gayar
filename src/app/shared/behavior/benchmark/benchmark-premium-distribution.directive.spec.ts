import { ComponentFixture } from '@angular/core/testing';
import { BenchmarkPremiumDistributionDirective } from './benchmark-premium-distribution.directive';
import { SearchService } from 'app/services/services';

describe('BenchmarkPremiumDistributionDirective', () => {
  let fixture: ComponentFixture<SearchService>;
  let searchService = fixture.debugElement.injector.get(SearchService);
  it('should create an instance', () => {
    const directive = new BenchmarkPremiumDistributionDirective(searchService);
    expect(directive).toBeTruthy();
  });
});
