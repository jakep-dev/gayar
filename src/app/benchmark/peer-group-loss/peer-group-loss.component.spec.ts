import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeerGroupLossComponent } from './peer-group-loss.component';

describe('PeerGroupLossComponent', () => {
  let component: PeerGroupLossComponent;
  let fixture: ComponentFixture<PeerGroupLossComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeerGroupLossComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerGroupLossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
