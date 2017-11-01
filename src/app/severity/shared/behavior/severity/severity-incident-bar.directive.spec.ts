import { SeverityIncidentBarDirective } from './severity-incident-bar.directive';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchService } from './../../../services/services';

describe('SeverityIncidentBarDirective', () => {
  let fixture: ComponentFixture<SearchService>;
  let searchService = fixture.debugElement.injector.get(SearchService);
  it('should create an instance', () => {
    const directive = new SeverityIncidentBarDirective(searchService);
    expect(directive).toBeTruthy();
  });
});
