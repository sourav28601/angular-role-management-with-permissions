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
import { Router, ActivatedRoute} from '@angular/router';
import { ApiService } from 'src/app/core/services/api/api.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-role',
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
  templateUrl: './edit-role.component.html',
  styleUrl: './edit-role.component.scss'
})
export class EditRoleComponent {
    roleForm: any;
    isSubmitted: boolean = false;
    categoryId: any;
    permissionData: any = [];
    permissionIds: any = [];
    allPermissions: any = [];
  
    get formControls() {
      return this.roleForm.controls;
    }
  
    constructor(
      private formBuilder: UntypedFormBuilder,
      public apiService: ApiService,
      private router: Router,
      private activateRoute: ActivatedRoute
    ) {}
  
    ngOnInit(): void {
      this.roleForm = this.formBuilder.group({
        name: ['', Validators.required],
        permissions: this.formBuilder.array([]), // Add array for permissions
      });
      this.categoryId = this.activateRoute.snapshot.paramMap.get('id');
      this.getRole();
      this.getAllPermissions();
    }
  
    getRole() {
      this.apiService.getRoleByID(this.categoryId).subscribe(
        (respData: any) => {
          this.setValue(respData?.data);
          respData.data.Permissions.forEach((per: any) => {
            this.permissionIds.push(per.id);
            const matchingPermission = this.permissionData.find(
              (p: any) => p.id === per.id
            );
            if (matchingPermission) {
              matchingPermission.completed = true;
            }
          });
          // Initialize the permissions in the form
          this.setPermissions();
        },
        (err) => {
          console.error('Error fetching role data:', err);
        }
      );
    }
  
    getAllPermissions() {
      this.apiService.getAllPermissions().subscribe(
        (respData: any) => {
          this.permissionData = respData.data.map((res: any) => ({
            ...res,
            completed: this.permissionIds.includes(res.id),
          }));
          this.setPermissions(); // Set permissions when data is fetched
        },
        (err) => {
          console.error('Error fetching permissions:', err);
        }
      );
    }
  
    setPermissions() {
      const permissionsFormArray = this.roleForm.controls['permissions'];
      this.permissionData.forEach((permission: any, index: number) => {
        permissionsFormArray.push(
          this.formBuilder.control(permission.completed)
        );
      });
    }
  
    updatePermissionStatus(permission: any) {
      permission.completed = !permission.completed;
    }
  
    setValue(formValue: any) {
      this.roleForm.controls['name'].setValue(formValue.name);
    }
  
    onSubmit() {
      this.isSubmitted = true;
      this.allPermissions = this.roleForm.value.permissions
        .map((completed: boolean, index: number) => {
          return completed ? this.permissionData[index].id : null;
        })
        .filter((id: any) => id !== null); // Filter out null values
  
      console.log("Updated permissions: ", this.allPermissions);
      console.log("Form value: ", this.roleForm.value);
      this.roleForm.value.permission_id = this.allPermissions;
      console.log("Final Form data: ", this.roleForm.value);
  
      this.apiService.updateRole(this.categoryId, this.roleForm.value).subscribe(
        (respData: any) => {
          Swal.fire({
            title: 'Success!',
            text: 'Role updated successfully.',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => {
            this.router.navigate(['/ui-components/role-list']);
          });
        },
        (err) => {
          Swal.fire({
            title: 'Error!',
            text: 'There was an error updating the role. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      );
    }
  }
  

  