import { TestBed, inject } from '@angular/core/testing';

import { BackgroundArtService } from './background-art.service';

describe('BackgroundArtService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BackgroundArtService]
    });
  });

  it('should be created', inject([BackgroundArtService], (service: BackgroundArtService) => {
    expect(service).toBeTruthy();
  }));
});
