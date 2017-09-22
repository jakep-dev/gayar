import { FrequencyIncidentBarDirective } from './frequency-incident-bar.directive';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchService } from './../../../services/services';

describe('FrequencyIncidentBarDirective', () => {
  let fixture: ComponentFixture<SearchService>;
  let searchService = fixture.debugElement.injector.get(SearchService);
  it('should create an instance', () => {
    const directive = new FrequencyIncidentBarDirective(searchService);
    expect(directive).toBeTruthy();
  });
});
