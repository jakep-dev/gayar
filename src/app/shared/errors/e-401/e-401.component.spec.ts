import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { E401Component } from './e-401.component';

describe('E401Component', () => {
  let component: E401Component;
  let fixture: ComponentFixture<E401Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ E401Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(E401Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
