import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyGeospatialComponent } from './property-geospatial.component';

describe('PropertyGeospatialComponent', () => {
  let component: PropertyGeospatialComponent;
  let fixture: ComponentFixture<PropertyGeospatialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyGeospatialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyGeospatialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
