import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MatButtonModule } from '@angular/material/button';

import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api/api.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './side-login.component.html',
  styleUrl: './side-login.component.scss',
})
// export class AppSideLoginComponent {
//   loginForm = new FormGroup({
//     email: new FormControl('', [
//       Validators.required, 
//       Validators.email,
//       Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
//     ])
//   });
//   constructor(private apiService: ApiService, private router: Router) {}
  
//   onSubmit() {
//     // Mark all fields as touched to show validation errors
//     if (this.loginForm.invalid) {
//       Object.keys(this.loginForm.controls).forEach(key => {
//         const control = this.loginForm.get(key);
//         control?.markAsTouched();
//       });
//       return;
//     }

//     const formData = this.loginForm.value;
//     this.apiService.login(formData).subscribe({
//       next: (response) => {
//         this.loginForm.reset();
//         Swal.fire({
//           title: 'OTP Send Successful',
//           text: 'OTP sent successfully to your registered email!',
//           icon: 'success',
//           confirmButtonText: 'OK',
//         }).then(() => {
//           this.router.navigate(['/authentication/verify-otp'], { 
//             queryParams: { email: formData.email } 
//           });
//         });
//       },
//       error: (error) => {
//         Swal.fire({
//           title: 'OTP Send Failed',
//           text: error.error?.message || 'There was a problem with your login.',
//           icon: 'error',
//           confirmButtonText: 'OK',
//         });
//       },
//     });
//   }
//   get emailControl() {
//     return this.loginForm.get('email');
//   }
// }

export class AppSideLoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    ]),
  });

  serverErrorMessage: string | null = null;

  constructor(private apiService: ApiService, private router: Router) {}

  onSubmit() {
    // Clear previous error message
    this.serverErrorMessage = null;

    // Mark all fields as touched to show validation errors
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach((key) => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const formData = this.loginForm.value;
    this.apiService.login(formData).subscribe({
      next: (response) => {
        this.loginForm.reset();
        Swal.fire({
          title: 'OTP Send Successful',
          text: 'OTP sent successfully to your registered email!',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          this.router.navigate(['/authentication/verify-otp'], {
            queryParams: { email: formData.email },
          });
        });
      },
      error: (error) => {
        // Capture API error message and display below the form
        this.serverErrorMessage =
          error.error?.message || 'There was a problem with your login.';
          Swal.fire({
            title: 'OTP Send Failed',
            text: this.serverErrorMessage || '', // Ensure text is always a string
            icon: 'error',
            confirmButtonText: 'OK',
          });
          
      },
    });
  }

  get emailControl() {
    return this.loginForm.get('email') ?? null; // Default to null if control is missing
  }
  
}

