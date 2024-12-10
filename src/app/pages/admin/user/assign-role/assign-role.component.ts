import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule,FormBuilder, FormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
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
  selector: 'app-assign-role',
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
    MatTableModule
  ],
  templateUrl: './assign-role.component.html',
  styleUrl: './assign-role.component.scss'
})

export class AssignRoleComponent {
  roleForm: FormGroup;
  roles : any;
  permissionRows : any;// Populate this dynamically
  isSubmitted = false;
  isOverride = false;
  selectedPermissionsCount = 0;

  constructor(private fb: FormBuilder,private apiService:ApiService,private router: Router,) {
    this.roleForm = this.fb.group({
      username: ['', Validators.required],
      role: ['', Validators.required],
    });
    this.getRoles();
  }

  get formControls() {
    return this.roleForm.controls;
  }

  toggleOverridePermissions() {
    this.getAllPermission();
    this.isOverride = !this.isOverride;
    if (!this.isOverride) {
      this.clearAllPermissions();
    }
  }
  getRoles() {
      this.apiService.getRoles().subscribe((respData: any) => {
        console.log("role respData")
         this.roles = respData.data
      }, (err) => {
        console.log("Error fetching permissions: ", err);
      });
    }
  getAllPermission() {
    this.apiService.getAllPermissions().subscribe((respData: any) => {
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
  
      console.log("permissionRows: ", this.permissionRows);
    }, (err) => {
      console.log("Error fetching permissions: ", err);
    });
  }
  clearAllPermissions() {
    this.permissionRows.forEach((row: { completed: boolean; }[]) =>
      row.forEach((permission: { completed: boolean; }) => (permission.completed = false))
    );
    this.updatePermissionCount();
  }

  updatePermissionCount() {
    this.selectedPermissionsCount = this.permissionRows.reduce(
      (count: any, row: { filter: (arg0: (permission: { completed: any; }) => any) => { (): any; new(): any; length: any; }; }) =>
        count + row.filter((permission: { completed: any; }) => permission.completed).length,
      0
    );
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.roleForm.invalid) return;

    const formData = {
      username: this.roleForm.value.username,
      role_id: this.roleForm.value.role,
      overridePermissions: this.isOverride,
      permission_id: this.isOverride
        ? this.permissionRows
            .flat()
            .filter((permission: { completed: any; }) => permission.completed)
            .map((permission: { id: any; }) => permission.id)
        : [],
    };
    
    console.log('Assign Role Data:', formData);
    this.apiService.assignRoleToUser(formData).subscribe(
      (respData: any) => {
        Swal.fire({
          title: 'Success!',
          text: 'Role Assigned successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/ui-components/role-list']);
        });
      },
      (err: any) => {
        Swal.fire({
          title: 'Error!',
          text: 'There was an error assigning the role. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
    // Call the assignRole API here
  }
}
