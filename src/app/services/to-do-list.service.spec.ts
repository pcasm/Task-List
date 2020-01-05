import { TestBed } from '@angular/core/testing';

import { ToDoListService } from './to-do-list.service';

describe('ToDoListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToDoListService = TestBed.get(ToDoListService);
    expect(service).toBeTruthy();
  });
});
