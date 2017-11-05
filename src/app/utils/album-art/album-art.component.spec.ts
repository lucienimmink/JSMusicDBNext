import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumArtComponent } from './album-art.component';

describe('AlbumArtComponent', () => {
  let component: AlbumArtComponent;
  let fixture: ComponentFixture<AlbumArtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlbumArtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumArtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
