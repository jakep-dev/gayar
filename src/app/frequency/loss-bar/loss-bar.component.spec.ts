import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LossBarComponent } from './loss-bar.component';

describe('LossBarComponent', () => {
  let component: LossBarComponent;
  let fixture: ComponentFixture<LossBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LossBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LossBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
