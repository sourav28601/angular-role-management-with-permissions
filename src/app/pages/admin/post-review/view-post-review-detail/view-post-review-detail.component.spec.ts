import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPostReviewDetailComponent } from './view-post-review-detail.component';

describe('ViewPostReviewDetailComponent', () => {
  let component: ViewPostReviewDetailComponent;
  let fixture: ComponentFixture<ViewPostReviewDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPostReviewDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPostReviewDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
