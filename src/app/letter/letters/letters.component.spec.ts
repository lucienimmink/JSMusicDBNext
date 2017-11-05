import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LettersComponent } from './letters.component';

describe('LettersComponent', () => {
  let component: LettersComponent;
  let fixture: ComponentFixture<LettersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LettersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LettersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
