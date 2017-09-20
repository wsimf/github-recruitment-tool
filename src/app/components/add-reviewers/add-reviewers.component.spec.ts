import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReviewersComponent } from './add-reviewers.component';

describe('AddReviewersComponent', () => {
  let component: AddReviewersComponent;
  let fixture: ComponentFixture<AddReviewersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddReviewersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReviewersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
