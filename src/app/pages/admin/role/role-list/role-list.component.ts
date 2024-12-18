import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import {FormsModule,ReactiveFormsModule,FormBuilder, FormGroup, Validators, UntypedFormBuilder, FormControl } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterLink, RouterLinkActive} from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
// import { ConfirmationDialogComponent } from 'src/app/user/pages/shared/confirmation-dialog/confirmation-dialog.component';
import { ViewPermissionsDialogComponent } from '../view-permissions-dialog/view-permissions-dialog.component';
import Swal from 'sweetalert2';
import { MatIcon } from '@angular/material/icon';
import { MatSpinner } from '@angular/material/progress-spinner';
import { MatLabel } from '@angular/material/form-field';
import { MatFormField } from '@angular/material/form-field';
interface RoleData {
  id: number;
  name: string;
  Permissions?: any[];
}

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIcon,
    MatSpinner,
    MatFormField,
    MatLabel
    
  ],
  templateUrl: './role-list.component.html',
  styleUrls: []
})
export class RoleListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'view_permission', 'actions'];
  dataSource!: MatTableDataSource<RoleData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Pagination and Search Controls
  search = new FormControl('');
  totalItems: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [10, 20, 50, 100];
  
  // Loading and Error States
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private apiService: ApiService, 
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.setupSearchListener();
    this.loadRoles();
  }

  // Setup search input listener
  setupSearchListener() {
    this.search.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.currentPage = 0;
        this.loadRoles();
      });
  }

  // Load roles with pagination and optional search
  // loadRoles() {
  //   this.loading = true;
  //   this.errorMessage = '';

  //   const params = {
  //     page: this.currentPage,
  //     limit: this.pageSize,
  //     search: this.search.value || ''
  //   };
  //   // getRoleList(params: { page?: number; limit?: number; search?: string } = {}) {
  //   //   return this.getApi('admin_role/view_role', params);
  //   // }
    
  //   this.apiService.getRoleList(params).subscribe({
  //     next: (response) => {
  //       this.loading = false;
        
  //       // Update datasource
  //       this.dataSource = new MatTableDataSource(response.data.items);
        
  //       // Update pagination details
  //       this.totalItems = response.data.totalItems;
  //       this.currentPage = response.data.currentPage;

  //       // Optional: Setup sorting if needed
  //       this.dataSource.sort = this.sort;
  //     },
  //     error: (error) => {
  //       this.loading = false;
  //       this.errorMessage = 'Failed to load roles. Please try again.';
  //       console.error('Error loading roles:', error);
        
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Oops...',
  //         text: this.errorMessage
  //       });
  //     }
  //   });
  // }
  
  loadRoles() {
    this.loading = true;
    this.errorMessage = '';
  
    const params = {
      page: this.currentPage, // Send 1-based page number to API
      limit: this.pageSize,
      search: this.search.value || '' // Include search query if needed
    };
  
    this.apiService.getRoleList(params).subscribe({
      next: (response) => {
        this.loading = false;
  
        // Update data source
        this.dataSource = new MatTableDataSource(response.data.items);
  
        // Update pagination details
        this.totalItems = response.data.totalItems;
        this.currentPage = response.data.currentPage;
  
        // Sync paginator with API response
        this.paginator.pageIndex = this.currentPage - 1; // 0-based for UI
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Failed to load roles. Please try again.';
        console.error('Error loading roles:', error);
  
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: this.errorMessage
        });
      }
    });
  }
  
  
  

  // Pagination event handler
  // pageChanged(event: any) {
  //   this.currentPage = event.pageIndex;
  //   this.pageSize = event.pageSize;
  //   this.loadRoles();
  // }

  pageChanged(event: any) {
    this.currentPage = event.pageIndex + 1; // Adjust to 1-based index for the API
    this.pageSize = event.pageSize;
    this.loadRoles();
  }
  
  
  // View Permissions Dialog
  viewPermissions(data: any) {
    this.dialog.open(ViewPermissionsDialogComponent, {data});
  }

  // Delete Role with Confirmation
  deleteRole(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteRole(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'The Role has been deleted.', 'success');
            this.loadRoles(); // Reload the current page after deletion
          },
          error: (error: any) => {
            console.error('Error deleting Role:', error);
            Swal.fire(
              'Error!',
              'There was an error deleting the Role. Please try again.',
              'error'
            );
          },
        });
      }
    });
  }
}

