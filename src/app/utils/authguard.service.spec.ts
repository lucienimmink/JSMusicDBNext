import { TestBed, inject } from '@angular/core/testing';

import { AuthGuardService } from './authguard.service';

describe('AuthguardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuardService]
    });
  });

  it('should be created', inject([AuthGuardService], (service: AuthGuardService) => {
    expect(service).toBeTruthy();
  }));
});
