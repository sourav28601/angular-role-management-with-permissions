import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPermissionsDialogComponent } from './view-permissions-dialog.component';

describe('ViewPermissionsDialogComponent', () => {
  let component: ViewPermissionsDialogComponent;
  let fixture: ComponentFixture<ViewPermissionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPermissionsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPermissionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
