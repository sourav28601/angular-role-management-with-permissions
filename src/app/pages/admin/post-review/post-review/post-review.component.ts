import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  UntypedFormBuilder,
  FormControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api/api.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ViewPostReviewDetailComponent } from '../view-post-review-detail/view-post-review-detail.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-post-review',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    CommonModule,
    MatTableModule,
    MatIcon,
    MatPaginator
  ],
  templateUrl: './post-review.component.html',
  styleUrl: './post-review.component.scss',
})
export class PostReviewComponent {
  postReviewForm: FormGroup;
  totalItems: number = 0;

  displayedColumns1: string[] = ['createdAt', 'type', 'channel', 'requested_by_adit', 'actions'];
  displayedColumns2: string[] = ['createdAt', 'type', 'channel', 'requested_by_adit', 'channel_link', 'comments', 'status'];

  dataSource1!: MatTableDataSource<any>; // For the first table
  dataSource2!: MatTableDataSource<any>; // For the second table

  @ViewChild(MatPaginator) paginator1!: MatPaginator;
  @ViewChild(MatPaginator) paginator2!: MatPaginator;
  @ViewChild(MatSort) sort1!: MatSort;
  @ViewChild(MatSort) sort2!: MatSort;

  loading: boolean = false;
  errorMessage: string = '';

  constructor(private fb: FormBuilder,private dialog: MatDialog, private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.initForm();
    this.loadPosts();
  }

  initForm() {
    this.postReviewForm = this.fb.group({
      type: ['', Validators.required],
      channel: ['', Validators.required],
      channel_link: [
        '',
        [Validators.required, Validators.pattern('^https?://.+')],
      ],
      requested_by_adit: [false, Validators.required],
      comments: ['', Validators.maxLength(500)],
      media_path: ['', Validators.required],
    });
  }

  loadPosts() {
    this.loading = true;
    this.errorMessage = '';

    const params = {
      page: 1,
      limit: 100, // Fetch all data
    };

    this.apiService.getPostOrReviewList(params).subscribe({
      next: (response) => {
        console.log("response",response)
        this.loading = false;

        const allItems = response.data.items;
        this.totalItems = response.data.totalItems; // Update total items
        
        // Filter data for each table
        const table1Data = allItems.filter((item: { requested_by_adit: boolean; }) => item.requested_by_adit === true);
        const table2Data = allItems;

        // Assign to data sources
        this.dataSource1 = new MatTableDataSource(table1Data);
        this.dataSource2 = new MatTableDataSource(table2Data);

        this.dataSource1.paginator = this.paginator1;
        this.dataSource1.sort = this.sort1;

        this.dataSource2.paginator = this.paginator2;
        this.dataSource2.sort = this.sort2;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Failed to load data. Please try again.';
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: this.errorMessage,
        });
      },
    });
  }
  // In your table component
viewPostOrReview(row: any) {
  console.log("row data",row)
  this.dialog.open(ViewPostReviewDetailComponent, {
    data: row,
    width: '600px'
  });
}
  onSubmit() {
    if (this.postReviewForm.valid) {
      const formData = new FormData();
      formData.append('type', this.postReviewForm.get('type')?.value);
      formData.append('channel', this.postReviewForm.get('channel')?.value);
      formData.append(
        'channel_link',
        this.postReviewForm.get('channel_link')?.value
      );
      formData.append(
        'requested_by_adit',
        this.postReviewForm.get('requested_by_adit')?.value
      );
      formData.append('comments', this.postReviewForm.get('comments')?.value);
      formData.append(
        'media_path',
        this.postReviewForm.get('media_path')?.value
      );

      this.apiService.addPostOrReview(formData).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Post or Review Added',
            text: 'Your post or review has been added successfully.',
          }).then(() => {
            location.reload();
            // this.router.navigate(['/ui-components/post-review']);
          });
          console.log('Post or review added successfully', response);
        },
        error: (error) => {
          const errorMessage =
            error?.error?.error ||
            error?.message ||
            'There was an error adding the post or review. Please try again.'; // Default message

          Swal.fire({
            title: 'Error!',
            text: errorMessage,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        },
      });
    }
  }

  onFileChange(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const mediaPathControl = this.postReviewForm.get('media_path');
      if (mediaPathControl) {
        mediaPathControl.setValue(fileInput.files[0]);
      }
    }
  }
}

// export class PostReviewComponent {
//   postReviewForm: FormGroup;
//   displayedColumns: string[] = ['createdAt', 'type', 'channel', 'requested_by_adit','channel_link','comments','status','actions'];
//   dataSource!: MatTableDataSource<any>;
  
//     @ViewChild(MatPaginator) paginator!: MatPaginator;
//     @ViewChild(MatSort) sort!: MatSort;
  
//     // Pagination and Search Controls
//     search = new FormControl('');
//     totalItems: number = 0;
//     currentPage: number = 1;
//     pageSize: number = 10;
//     pageSizeOptions: number[] = [10, 20, 50, 100];
//   loading: boolean = false;
//   errorMessage: string = '';

//   constructor(
//     private fb: FormBuilder,
//     private apiService: ApiService,
//     private router: Router
//   ) {}

//   ngOnInit() {
//     this.initForm();
//     this.loadPosts();
//   }

//   initForm() {
//     this.postReviewForm = this.fb.group({
//       type: ['', Validators.required],
//       channel: ['', Validators.required],
//       channel_link: [
//         '',
//         [Validators.required, Validators.pattern('^https?://.+')],
//       ],
//       requested_by_adit: [false, Validators.required],
//       comments: ['', Validators.maxLength(500)],
//       media_path: ['', Validators.required],
//     });
//   }

//   onSubmit() {
//     if (this.postReviewForm.valid) {
//       const formData = new FormData();
//       formData.append('type', this.postReviewForm.get('type')?.value);
//       formData.append('channel', this.postReviewForm.get('channel')?.value);
//       formData.append(
//         'channel_link',
//         this.postReviewForm.get('channel_link')?.value
//       );
//       formData.append(
//         'requested_by_adit',
//         this.postReviewForm.get('requested_by_adit')?.value
//       );
//       formData.append('comments', this.postReviewForm.get('comments')?.value);
//       formData.append(
//         'media_path',
//         this.postReviewForm.get('media_path')?.value
//       );

//       this.apiService.addPostOrReview(formData).subscribe({
//         next: (response) => {
//           Swal.fire({
//             icon: 'success',
//             title: 'Post or Review Added',
//             text: 'Your post or review has been added successfully.',
//           }).then(() => {
//             location.reload();
//             // this.router.navigate(['/ui-components/post-review']);
//           });
//           console.log('Post or review added successfully', response);
//         },
//         error: (error) => {
//           const errorMessage =
//             error?.error?.error ||
//             error?.message ||
//             'There was an error adding the post or review. Please try again.'; // Default message

//           Swal.fire({
//             title: 'Error!',
//             text: errorMessage,
//             icon: 'error',
//             confirmButtonText: 'OK',
//           });
//         },
//       });
//     }
//   }

//   onFileChange(event: Event) {
//     const fileInput = event.target as HTMLInputElement;
//     if (fileInput && fileInput.files && fileInput.files.length > 0) {
//       const mediaPathControl = this.postReviewForm.get('media_path');
//       if (mediaPathControl) {
//         mediaPathControl.setValue(fileInput.files[0]);
//       }
//     }
//   }

//   loadPosts() {
//       this.loading = true;
//       this.errorMessage = '';
    
//       const params = {
//         page: this.currentPage, // Send 1-based page number to API
//         limit: this.pageSize,
//         search: this.search.value || '' // Include search query if needed
//       };
    
//        this.apiService.getPostOrReviewList(params).subscribe({
//            next: (response) => {
//             console.log("response--",response)
//              this.loading = false;
       
//              // Update data source
//              this.dataSource = new MatTableDataSource(response.data.items);
       
//              // Update pagination details
//              this.totalItems = response.data.totalItems;
//              this.currentPage = response.data.currentPage;
       
//             //  this.paginator.pageIndex = this.currentPage - 1; 
//            },
//            error: (error) => {
//              this.loading = false;
//              this.errorMessage = 'Failed to load roles. Please try again.';
//              console.error('Error loading roles:', error);
       
//              Swal.fire({
//                icon: 'error',
//                title: 'Oops...',
//                text: this.errorMessage
//              });
//            }
//          });
//   }
// }
