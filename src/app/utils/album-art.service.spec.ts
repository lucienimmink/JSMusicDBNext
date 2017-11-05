import { TestBed, inject } from '@angular/core/testing';

import { AlbumArtService } from './album-art.service';

describe('AlbumArtService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlbumArtService]
    });
  });

  it('should be created', inject([AlbumArtService], (service: AlbumArtService) => {
    expect(service).toBeTruthy();
  }));
});
