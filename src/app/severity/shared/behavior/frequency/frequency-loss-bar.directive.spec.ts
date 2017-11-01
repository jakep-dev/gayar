import { FrequencyLossBarDirective } from './frequency-loss-bar.directive';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchService } from './../../../services/services';

describe('FrequencyLossBarDirective', () => {
  let fixture: ComponentFixture<SearchService>;
  let searchService = fixture.debugElement.injector.get(SearchService);
  it('should create an instance', () => {
    const directive = new FrequencyLossBarDirective(searchService);
    expect(directive).toBeTruthy();
  });
});
