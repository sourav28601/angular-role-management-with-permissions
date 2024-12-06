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
  ],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required])
  });
  constructor(private apiService: ApiService, private router: Router) {}
  
  onSubmit() {
    console.log('Form submitted');
    console.log('Login Form Value:', this.loginForm.value);
  
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      console.log('Form Data:', formData);
      this.apiService.login(formData).subscribe({
        next: (response) => {
          
          this.loginForm.reset();
          Swal.fire({
            title: 'OTP Send Successful',
            text: 'OTP sent successfully to your registered email!',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => {
            // this.router.navigate(['/dashboard']);
            this.router.navigate(['/authentication/verify-otp'], { queryParams: { email: formData.email } });
          });
        },
        error: (error) => {
          console.log('error----', error);
          console.error('Login failed', error);
          Swal.fire({
            title: 'OTP Send Failed',
            text: error.error.message || 'There was a problem with your login.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        },
      });
    } else {
      console.log('Form is invalid');
      Object.values(this.loginForm.controls).forEach((control) => control.markAsTouched());
    }
  }
}
