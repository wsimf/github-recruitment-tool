import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCanComponent } from './edit-can.component';

describe('EditCanComponent', () => {
  let component: EditCanComponent;
  let fixture: ComponentFixture<EditCanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
