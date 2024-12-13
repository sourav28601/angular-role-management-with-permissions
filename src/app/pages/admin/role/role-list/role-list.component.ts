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
// import { ConfirmationDialogComponent } from 'src/app/user/pages/shared/confirmation-dialog/confirmation-dialog.component';
import { ViewPermissionsDialogComponent } from '../view-permissions-dialog/view-permissions-dialog.component';
import Swal from 'sweetalert2';
import { MatIcon } from '@angular/material/icon';

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
      MatIcon
    ],
    templateUrl: './role-list.component.html',
    styleUrls: []
})

export class RoleListComponent  {
    displayedColumns: string[] = ['id', 'name','view_permission', 'actions'];
    dataSource!: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    resultData: any = [];
    search = new FormControl('');
    filter = new FormControl('');
    searchOptions: any = '';
    lastSearchValue: any;
    loading: any;
    lastfilterValue: any;
    filterOptions: any;
    totalRows: number = 0;
    pageSize: number = 10;
    currentPage: any = 0;
    pageSizeOptions: number[] = [10, 25, 50, 100];
    constructor(
        private apiService: ApiService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.getRole();
    }

    viewPermissions(data:any) {
        this.dialog.open(ViewPermissionsDialogComponent, { data });   
    }

    getRole() {
        var pageNo = this.currentPage + 1
        this.apiService.getRoleList().subscribe((respData: any) => {
            // if (respData?.isError == false) {
            console.log("respData----",respData.data)
                this.resultData = respData.data
                this.dataSource = new MatTableDataSource(respData.data);
                this.dataSource.sort = this.sort;
                this.totalRows = respData.data ? respData.data.length : respData.data;
            // }
        }, (err) => {
          console.log("err----",err)
            // this.toastrService.showError(err.message, 'Error');
        });
    }

   
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
              Swal.fire(
                'Deleted!',
                'The Role has been deleted.',
                'success'
              );
              location.reload();
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
