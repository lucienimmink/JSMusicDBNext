import { TestBed, inject } from '@angular/core/testing';

import { PathService } from './path.service';

describe('PathService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PathService]
    });
  });

  it('should be created', inject([PathService], (service: PathService) => {
    expect(service).toBeTruthy();
  }));
});
