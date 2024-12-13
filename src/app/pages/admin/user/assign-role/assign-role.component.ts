import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api/api.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';

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
    MatTableModule,
    MatIconModule
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
  showPassword = true; 
  showConfirmPassword = true; 
  passwordStrength = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.roleForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
          ),
        ],
      ],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required],
      is_active: ['', Validators.required],
    }, { validator: this.matchPasswords });    
    this.getRoles();
  }
  matchPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notMatching: true };
  }
  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
  generatePassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$!%*?&';
    const password = Array.from({ length: 12 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
    
    // Update both password and confirmPassword fields
    this.roleForm.patchValue({ 
      password: password, 
      confirmPassword: password  // Set the same value for confirm password
    });
    this.checkPasswordStrength();
  }
  
  
  
  checkPasswordStrength() {
    const password = this.roleForm.get('password')?.value || '';
    if (password.length < 8) {
      this.passwordStrength = 'Weak';
    } else if (/^(?=.*[A-Z])(?=.*[@$!%*?&]).{8,}$/.test(password)) {
      this.passwordStrength = 'Strong';
    } else {
      this.passwordStrength = 'Moderate';
    }
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
      respData.data.map((res: any) => {
        res.completed = false;
      });
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
    if (this.roleForm.invalid || this.roleForm.hasError('notMatching')) {
      return;
    }
    

    const formData = {
      username: this.roleForm.value.username,
      email: this.roleForm.value.email,
      password: this.roleForm.value.password,
      role_id: this.roleForm.value.role,
      is_active: this.roleForm.value.is_active === 'true',
      overridePermissions: this.isOverride,
      permission_id: this.isOverride
        ? this.permissionRows
            .flat()
            .filter((permission: { completed: any }) => permission.completed)
            .map((permission: { id: any }) => permission.id)
        : [],
    };

    console.log('Assign Role Data:', formData);
    this.apiService.assignRoleToUser(formData).subscribe(
      (respData: any) => {
        Swal.fire({
          title: 'Success!',
          text: 'Role Assigned successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          this.router.navigate(['/ui-components/user-list']);
        });
      },
      (err: any) => {
        Swal.fire({
          title: 'Error!',
          text: 'There was an error assigning the role. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    );
  }
}
