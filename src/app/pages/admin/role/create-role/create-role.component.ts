import { Component, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  UntypedFormBuilder,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api/api.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-role',
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
  ],
  templateUrl: './create-role.component.html',
  styleUrl: './create-role.component.scss',
})
export class CreateRoleComponent {
  roleForm: UntypedFormBuilder | any;
  isSubmitted: boolean = false;
  allPermissions: any = [];
  permisson_obj: any;
  allComplete: boolean = false;
  checkedpermissionData: any;
  permissionData: any;
  snackBar: any;
  permissionRows: any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    public apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.roleForm = this.formBuilder.group({
      name: ['', Validators.required],
      permission_id: ['', Validators.required],
    });
    this.getAllPermission();
  }
  get formControls() {
    return this.roleForm.controls;
  }

  getAllPermission() {
    this.apiService.getAllPermissions().subscribe(
      (respData: any) => {
        // Format and update permissions
        respData.data.map((res: any) => {
          res.completed = false;
        });

        // Flatten the permissions into rows of 4
        const chunkSize = 4;
        this.permissionRows = [];
        for (let i = 0; i < respData.data.length; i += chunkSize) {
          this.permissionRows.push(respData.data.slice(i, i + chunkSize));
        }

        console.log('permissionRows: ', this.permissionRows);
      },
      (err) => {
        console.log('Error fetching permissions: ', err);
      }
    );
  }

  onSubmit() {
    this.isSubmitted = true;

    // Gather selected permission IDs directly
    this.allPermissions = this.permissionRows
      .flat() 
      .filter((permission: any) => permission.completed) // Keep only selected permissions
      .map((permission: any) => permission.id); // Map to IDs

    // Assign selected permission IDs to the form value
    this.roleForm.value.permission_id = this.allPermissions;

    console.log('Role Form Data:', this.roleForm.value);

    // Check if form is valid
    // if (this.roleForm.invalid || this.allPermissions.length === 0) {
    //   Swal.fire({
    //     title: 'Validation Error!',
    //     text: 'Please fill all required fields and select at least one permission.',
    //     icon: 'warning',
    //     confirmButtonText: 'OK'
    //   });
    //   return;
    // }

    // Hit the Create Role API
    this.apiService.createRole(this.roleForm.value).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Success!',
          text: 'Role created successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          this.router.navigate(['/ui-components/role-list']);
        });
      },
      error: (error) => {
        const errorMessage =
          error?.error?.error || // Specific message from API response
          error?.message || // Fallback to the general error message
          'There was an error creating the role. Please try again.'; // Default message
    
        Swal.fire({
          title: 'Error!',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      },
    });    
    
  }

  setAll(completed: boolean, data: any) {
    this.checkedpermissionData = this.permisson_obj.filter(
      (p: any) => p[0] == data
    );

    this.allComplete = completed;

    if (this.checkedpermissionData[0][1] == null) {
      return;
    }
    this.checkedpermissionData[0][1].forEach(
      (t: any) => (t.completed = completed)
    );
  }

  updateAllComplete() {
    this.allComplete =
      this.checkedpermissionData != null &&
      this.checkedpermissionData.every((t: any) => t.completed);
  }

  someComplete(): boolean {
    if (this.checkedpermissionData == null) {
      return false;
    }
    return (
      this.checkedpermissionData.filter((t: any) => t.completed).length > 0 &&
      !this.allComplete
    );
  }

  groupBy(obj: any, prop: any) {
    return obj.reduce((acc: any, item: any) => {
      let key = item[prop];
      if (typeof key === 'string') {
        key = key.replace(/\s+/g, '');
      }
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});
  }
}
