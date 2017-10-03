import { WindowListenerDirective } from './window-listener.directive';
import { ComponentFixture } from '@angular/core/testing';
import { SessionStorageService } from 'app/services/services';
describe('WindowListenerDirective', () => {
  let fixture: ComponentFixture<SessionStorageService>;
  let sessionStorageService = fixture.debugElement.injector.get(SessionStorageService);
  it('should create an instance', () => {
    const directive = new WindowListenerDirective(sessionStorageService);
    expect(directive).toBeTruthy();
  });
});
