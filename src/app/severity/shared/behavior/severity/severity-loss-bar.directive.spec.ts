import { SeverityLossBarDirective } from './severity-loss-bar.directive';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchService } from 'app/services/services';

describe('SeverityLossBarDirective', () => {
  let fixture: ComponentFixture<SearchService>;
  let searchService = fixture.debugElement.injector.get(SearchService);
  it('should create an instance', () => {
    const directive = new SeverityLossBarDirective(searchService);
    expect(directive).toBeTruthy();
  });
});
