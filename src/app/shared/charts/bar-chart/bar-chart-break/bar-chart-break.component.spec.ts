import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartBreakComponent } from './bar-chart-break.component';

describe('BarChartBreak.Component.TsComponent', () => {
  let component: BarChartBreakComponent;
  let fixture: ComponentFixture<BarChartBreakComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarChartBreakComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarChartBreakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
