import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ApiService } from '../../../core/services/api/api.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
  FormBuilder
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.scss'
})
export class VerifyOtpComponent {
  otpForm: FormGroup;
  otpArray = [1, 2, 3, 4];
  email: string | null = null;
  constructor(private apiService: ApiService, private router: Router,private fb: FormBuilder,private route: ActivatedRoute){
    this.otpForm = this.fb.group({
      digit1: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      digit2: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      digit3: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      digit4: ['', [Validators.required, Validators.pattern(/^\d$/)]],
    });
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'];
      console.log('Received email:', this.email);
    });
  }

  focusNext(event: any, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 1 && index < this.otpArray.length - 1) {
      const nextInput = document.querySelectorAll('.otp-box')[index + 1] as HTMLInputElement;
      nextInput.focus();
    }
  }

  focusPrevious(event: any, index: number) {
    const input = event.target as HTMLInputElement;
    if (!input.value && index > 0) {
      const previousInput = document.querySelectorAll('.otp-box')[index - 1] as HTMLInputElement;
      previousInput.focus();
    }
  }

  onVerifyOtp() {
    if (this.otpForm.valid) {
      const otp = Object.values(this.otpForm.value).join('');
      console.log('OTP:', otp);
  
      // Check if email is available
      if (!this.email) {
        Swal.fire({
          title: 'Email Missing',
          text: 'Email is not available. Please retry the process.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        return;
      }
  
      // Prepare the payload
      const payload = {
        email: this.email,
        otp: otp,
      };
  
      console.log('Payload:', payload);
  
      this.apiService.verifyOTP(payload).subscribe({
        next: (response) => {
          localStorage.setItem('user_data', JSON.stringify(response));
          this.otpForm.reset();
          Swal.fire({
            title: 'OTP Verified Successfully',
            text: 'OTP verified successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => {
            this.router.navigate(['/dashboard']); // Redirect after successful verification
          });
        },
        error: (error) => {
          console.log('Verification error:', error);
          Swal.fire({
            title: 'OTP Verification Failed',
            text: error.error.message || 'Failed to verify the OTP.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        },
      });
    } else {
      Swal.fire({
        title: 'Invalid OTP',
        text: 'Please enter a valid OTP.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    }
  }
}
