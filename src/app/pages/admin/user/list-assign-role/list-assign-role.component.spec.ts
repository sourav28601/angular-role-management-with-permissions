import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAssignRoleComponent } from './list-assign-role.component';

describe('ListAssignRoleComponent', () => {
  let component: ListAssignRoleComponent;
  let fixture: ComponentFixture<ListAssignRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAssignRoleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAssignRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
