import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal, { SweetAlertOptions } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private previousUrl: string = '/';
  private currentUrl: string = '/';

  constructor(private router: Router) {
    this.initializeNavigation();
  }

  private initializeNavigation() {
    // Store previous and current URLs on navigation
    this.router.events.subscribe(() => {
      this.previousUrl = this.currentUrl;
      this.currentUrl = this.router.url;
    });
  }

  getPreviousUrl(): string {
    return this.previousUrl || '/';
  }

  navigateToLastRoute() {
    const lastRoute = this.getPreviousUrl();
    this.router.navigate([lastRoute]);
  }

  showErrorAndRedirect(
    options: {
      title?: string, 
      text?: string, 
      redirectRoute?: string
    } = {}
  ) {
    const {
      title = 'Error',
      text = 'An unexpected error occurred.',
      redirectRoute = this.getPreviousUrl()
    } = options;

    const swalOptions: SweetAlertOptions = {
      icon: 'error',
      title: title,
      text: text,
      confirmButtonText: 'OK',
      confirmButtonColor: '#3085d6',
    };

    Swal.fire(swalOptions).then((result) => {
      // Navigate after the alert is closed
      if (result.isConfirmed || result.isDismissed) {
        this.router.navigate([redirectRoute]);
      }
    });
  }
}