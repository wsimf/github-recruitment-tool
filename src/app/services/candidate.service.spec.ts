import { TestBed, inject } from '@angular/core/testing';

import { DatabaseClientService } from './candidate.service';

describe('DatabaseClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatabaseClientService]
    });
  });

  it('should be created', inject([DatabaseClientService], (service: DatabaseClientService) => {
    expect(service).toBeTruthy();
  }));
});
