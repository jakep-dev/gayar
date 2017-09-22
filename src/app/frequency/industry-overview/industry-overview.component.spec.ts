import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustryOverviewComponent } from './industry-overview.component';

describe('IndustryOverviewComponent', () => {
  let component: IndustryOverviewComponent;
  let fixture: ComponentFixture<IndustryOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndustryOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndustryOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
