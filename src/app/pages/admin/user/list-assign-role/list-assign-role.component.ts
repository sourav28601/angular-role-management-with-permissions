import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ViewUserPermissionsDialogComponent } from '../view-user-permissions-dialog/view-user-permissions-dialog.component';
import Swal from 'sweetalert2';

// Define an interface for the user data
interface UserData {
  id: number;
  username: string;
  email: string;
  is_active: string;
  User_Permissions?: any[];
}

@Component({
  selector: 'app-list-assign-role',
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
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule
  ],
  templateUrl: './list-assign-role.component.html',
  styleUrls: ['./list-assign-role.component.scss']
})
export class ListAssignRoleComponent implements OnInit {
  // Columns to be displayed in the table
  displayedColumns: string[] = ['id', 'name', 'email', 'is_active', 'view_permission', 'actions'];
  
  // Data source for the table
  dataSource!: MatTableDataSource<UserData>;

  // View child decorators for paginator and sort
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Search and pagination controls
  search = new FormControl('');
  totalItems: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  pageSizeOptions: number[] = [10, 25, 50, 100];

  // Loading and error states
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Setup search listener
    this.setupSearchListener();
    
    // Load initial user list
    this.loadUsers();
  }

  // Setup search input listener with debounce
  setupSearchListener() {
    this.search.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.currentPage = 0;
        this.loadUsers();
      });
  }

  // Load users with pagination and optional search
  loadUsers() {
    this.loading = true;
    this.errorMessage = '';

    // Prepare request parameters
    const params = {
      page: this.currentPage,
      limit: this.pageSize,
      search: this.search.value || ''
    };

    // Call API to get user list
    this.apiService.getUserList(params).subscribe({
      next: (response) => {
        this.loading = false;
        
        // Update datasource
        this.dataSource = new MatTableDataSource(response.data.items);
        
        // Update pagination details
        this.totalItems = response.data.totalItems;
        this.currentPage = response.data.currentPage;

        // Setup sorting
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Failed to load users. Please try again.';
        console.error('Error loading users:', error);
        
        // Show error using SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: this.errorMessage
        });
      }
    });
  }

  // Pagination event handler
  pageChanged(event: any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  // View User Permissions
  viewPermissions(userPermissions: any) {
    // Extract permission names
   console.log("userPermissions-",userPermissions)
    const permissions = userPermissions.map((permission: { Permission: { permissionName: any; }; }) => 
      permission.Permission.permissionName
    );

    // Open dialog to show permissions
    this.dialog.open(ViewUserPermissionsDialogComponent, { 
      data: permissions
    });
  }

  // Delete User with Confirmation
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
        this.apiService.deleteUser(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'The User has been deleted.', 'success');
            this.loadUsers(); // Reload the current page after deletion
          },
          error: (error: any) => {
            console.error('Error deleting User:', error);
            Swal.fire(
              'Error!',
              'There was an error deleting the User. Please try again.',
              'error'
            );
          },
        });
      }
    });
  }
}