import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserPermissionsDialogComponent } from './view-user-permissions-dialog.component';

describe('ViewUserPermissionsDialogComponent', () => {
  let component: ViewUserPermissionsDialogComponent;
  let fixture: ComponentFixture<ViewUserPermissionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewUserPermissionsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewUserPermissionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
