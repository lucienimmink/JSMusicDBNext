import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterDetailComponent } from './letter-detail.component';

describe('LetterDetailComponent', () => {
  let component: LetterDetailComponent;
  let fixture: ComponentFixture<LetterDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
