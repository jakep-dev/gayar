import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTableMobileComponent } from './search-table-mobile.component';

describe('SearchTableMobileComponent', () => {
  let component: SearchTableMobileComponent;
  let fixture: ComponentFixture<SearchTableMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchTableMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchTableMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
