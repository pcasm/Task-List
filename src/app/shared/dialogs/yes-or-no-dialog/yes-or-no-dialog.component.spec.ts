import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YesOrNoDialogComponent } from './yes-or-no-dialog.component';

describe('YesOrNoDialogComponent', () => {
  let component: YesOrNoDialogComponent;
  let fixture: ComponentFixture<YesOrNoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YesOrNoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YesOrNoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
