import { TestBed, inject } from '@angular/core/testing';

import { ReviewerService } from './reviewer.service';

describe('ReviewerServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReviewerService]
    });
  });

  it('should be created', inject([ReviewerService], (service: ReviewerService) => {
    expect(service).toBeTruthy();
  }));
});
