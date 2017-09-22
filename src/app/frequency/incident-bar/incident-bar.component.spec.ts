import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentBarComponent } from './incident-bar.component';

describe('IncidentBarComponent', () => {
  let component: IncidentBarComponent;
  let fixture: ComponentFixture<IncidentBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidentBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
