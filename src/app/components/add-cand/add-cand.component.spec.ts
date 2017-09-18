import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCandComponent } from './add-cand.component';

describe('AddCandComponent', () => {
  let component: AddCandComponent;
  let fixture: ComponentFixture<AddCandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
