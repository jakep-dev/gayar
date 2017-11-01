import { ComponentFixture } from '@angular/core/testing';
import { BenchmarkRetentionDistributionDirective } from './benchmark-retention-distribution.directive';
import { SearchService } from 'app/services/services';

describe('BenchmarkRetentionDistributionDirective', () => {
  let fixture: ComponentFixture<SearchService>;
  let searchService = fixture.debugElement.injector.get(SearchService);
  it('should create an instance', () => {
    const directive = new BenchmarkRetentionDistributionDirective(searchService);
    expect(directive).toBeTruthy();
  });
});
