import { Routes } from '@angular/router';

import { AppSideLoginComponent } from './side-login/side-login.component';
import { AppSideRegisterComponent } from './side-register/side-register.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { OuterGuard } from 'src/app/core/guards/outer/outer.guard';
export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        canActivate: [OuterGuard],
        component: AppSideLoginComponent,
      },
      {
        path: 'register',
        canActivate: [OuterGuard],
        component: AppSideRegisterComponent,
      },
      {
        path: 'verify-otp',
        canActivate: [OuterGuard],
        component: VerifyOtpComponent,
      },
    ],
  },
];
