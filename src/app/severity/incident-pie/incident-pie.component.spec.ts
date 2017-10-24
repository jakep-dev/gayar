import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentPieComponent } from './incident-pie.component';

describe('IncidentPieComponent', () => {
  let component: IncidentPieComponent;
  let fixture: ComponentFixture<IncidentPieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidentPieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentPieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
