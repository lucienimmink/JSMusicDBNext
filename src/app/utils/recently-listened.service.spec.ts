import { TestBed, inject } from '@angular/core/testing';

import { RecentlyListenedService } from './recently-listened.service';

describe('RecentlyListenedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecentlyListenedService]
    });
  });

  it('should be created', inject([RecentlyListenedService], (service: RecentlyListenedService) => {
    expect(service).toBeTruthy();
  }));
});
