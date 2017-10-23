import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LossPieComponent } from './loss-pie.component';

describe('LossPieComponent', () => {
  let component: LossPieComponent;
  let fixture: ComponentFixture<LossPieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LossPieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LossPieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
