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
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/core/services/api/api.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-edit-assign-role',
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
  ],
  templateUrl: './edit-assign-role.component.html',
  styleUrl: './edit-assign-role.component.scss',
})
export class EditAssignRoleComponent implements OnInit {
  roleForm: FormGroup;
  roles: any;
  permissionRows: any[] = [];
  userId: string | null = '';
  isSubmitted = false;
  isOverride = false;
  selectedPermissionsCount = 0;
  showPassword = false;
  showConfirmPassword = false;
  passwordStrength = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.roleForm = this.fb.group(
      {
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
      },
      { validator: this.matchPasswords }
    );

    if (this.userId) {
      this.getUserDataById(this.userId);
    }
    this.getRoles();
  }

  ngOnInit(): void {}

  matchPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notMatching: true };
  }

  getUserDataById(userId: string) {
    this.apiService.getUserDataByID(userId).subscribe(
      {
        next: (respData) => {
          console.log('Edit respData---', respData);
          const userData = respData.data;
          // Populate form fields
          this.roleForm.patchValue({
            username: userData.username,
            email: userData.email,
            role: userData.User_Roles?.[0]?.role_id || '',
            is_active: userData.is_active ? 'true' : 'false',
          });

          // Handle permissions for override
          this.isOverride = !!userData.User_Permissions.length;
          const userPermissions = userData.User_Permissions.map(
            (p: any) => p.permission_id
          );

          this.getAllPermission(() => {
            // Mark user's permissions as checked
            this.permissionRows.forEach((row) => {
              row.forEach((permission: any) => {
                permission.completed = userPermissions.includes(permission.id);
              });
            });
            this.updatePermissionCount();
          });
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        },
      }
      // (respData: any) => {
      //   console.log('Edit respData---', respData);
      //   const userData = respData.data;

      //   // Populate form fields
      //   this.roleForm.patchValue({
      //     username: userData.username,
      //     email: userData.email,
      //     role: userData.User_Roles?.[0]?.role_id || '',
      //     is_active: userData.is_active ? 'true' : 'false',
      //   });

      //   // Handle permissions for override
      //   this.isOverride = !!userData.User_Permissions.length;
      //   const userPermissions = userData.User_Permissions.map(
      //     (p: any) => p.permission_id
      //   );

      //   this.getAllPermission(() => {
      //     // Mark user's permissions as checked
      //     this.permissionRows.forEach((row) => {
      //       row.forEach((permission: any) => {
      //         permission.completed = userPermissions.includes(permission.id);
      //       });
      //     });
      //     this.updatePermissionCount();
      //   });
      // },
      // (err) => {
      //   console.error('Error fetching user data:', err);
      // }
    );
  }

  getAllPermission(callback?: Function) {
    this.apiService.getAllPermissions().subscribe(
      {
        next: (respData) => {
          respData.data.map((permission: any) => {
            permission.completed = false; // Default unchecked
          });
          this.permissionRows = this.chunkPermissions(respData.data);
          if (callback) callback();
        },
        error: (error) => {
          console.error('Error fetching permissions:', error);
        },
      }
      // (respData: any) => {
      //   respData.data.map((permission: any) => {
      //     permission.completed = false; // Default unchecked
      //   });
      //   this.permissionRows = this.chunkPermissions(respData.data);
      //   if (callback) callback();
      // },
      // (err) => {
      //   console.error('Error fetching permissions:', err);
      // }
    );
  }

  generatePassword(): void {
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    const generatedPassword = Array.from({ length: 12 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');

    // Set the generated password for both password and confirmPassword fields
    this.roleForm.patchValue({
      password: generatedPassword,
      confirmPassword: generatedPassword,
    });

    // Update password strength after generating
    this.checkPasswordStrength();
  }

  checkPasswordStrength(): void {
    const password = this.roleForm.get('password')?.value || '';
    if (
      password.length >= 12 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*]/.test(password)
    ) {
      this.passwordStrength = 'Strong';
    } else if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password)
    ) {
      this.passwordStrength = 'Moderate';
    } else {
      this.passwordStrength = 'Weak';
    }
  }

  calculatePasswordStrength(password: string): string {
    if (password.length < 8) {
      return 'Weak';
    } else if (password.match(/[A-Z]/) && password.match(/[0-9]/)) {
      return 'Moderate';
    } else if (
      password.match(/[A-Z]/) &&
      password.match(/[0-9]/) &&
      password.match(/[@$!%*?&]/)
    ) {
      return 'Strong';
    }
    return 'Weak';
  }

  chunkPermissions(permissions: any[]): any[] {
    const chunkSize = 4;
    const permissionRows = [];
    for (let i = 0; i < permissions.length; i += chunkSize) {
      permissionRows.push(permissions.slice(i, i + chunkSize));
    }
    return permissionRows;
  }

  getRoles() {
    this.apiService.getRoles().subscribe(
      {
        next: (respData) => {
          this.roles = respData.data
        },
        error: (error) => {
          console.error('Error fetching roles:', error);
        },
        }
      // (respData: any) => {
      //   this.roles = respData.data;
      // },
      // (err) => {
      //   console.error('Error fetching roles:', err);
      // }
    );
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  toggleOverridePermissions() {
    if (!this.isOverride) {
      this.getAllPermission();
    }
    this.isOverride = !this.isOverride;
    if (!this.isOverride) {
      this.clearAllPermissions();
    }
  }

  updatePermissionCount() {
    this.selectedPermissionsCount = this.permissionRows
      .flat()
      .filter((permission: { completed: any }) => permission.completed).length;
  }

  clearAllPermissions() {
    this.permissionRows.forEach((row) => {
      row.forEach(
        (permission: { completed: boolean }) => (permission.completed = false)
      );
    });
    this.updatePermissionCount();
  }

  onSubmit() {
    this.isSubmitted = true;

    if (this.roleForm.invalid || this.roleForm.hasError('notMatching')) {
      console.error('Form is invalid or passwords do not match.');
      return;
    }

    const formData = {
      username: this.roleForm.value.username,
      email: this.roleForm.value.email,
      password: this.roleForm.value.password,
      is_active: this.roleForm.value.is_active === 'true', // Ensure boolean conversion
      role_id: this.roleForm.value.role,
      permission_id: this.isOverride
        ? this.permissionRows
            .flat()
            .filter((permission: { completed: any }) => permission.completed)
            .map((permission: { id: any }) => permission.id)
        : [],
    };

    console.log('formData----', formData);

    if (this.userId) {
      this.apiService.updateUser(this.userId, formData).subscribe(
        {
          next: (respData) => {
            Swal.fire({
                  title: 'Success!',
                  text: 'User updated successfully.',
                  icon: 'success',
                  confirmButtonText: 'OK',
                }).then(() => {
                  this.router.navigate(['/ui-components/user-list']);
                });
              },

          error: (error) => {
            Swal.fire({
                  title: 'Error!',
                  text: 'There was an error updating the user. Please try again.',
                  icon: 'error',
                  confirmButtonText: 'OK',
                });
              }
          }
        // (respData: any) => {
        //   Swal.fire({
        //     title: 'Success!',
        //     text: 'User updated successfully.',
        //     icon: 'success',
        //     confirmButtonText: 'OK',
        //   }).then(() => {
        //     this.router.navigate(['/ui-components/user-list']);
        //   });
        // },
        // (err: any) => {
        //   Swal.fire({
        //     title: 'Error!',
        //     text: 'There was an error updating the user. Please try again.',
        //     icon: 'error',
        //     confirmButtonText: 'OK',
        //   });
        // }
      );
    }
  }

  get formControls() {
    return this.roleForm.controls;
  }
}
