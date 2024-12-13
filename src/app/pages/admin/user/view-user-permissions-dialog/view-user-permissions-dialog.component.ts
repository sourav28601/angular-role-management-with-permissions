import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-view-user-permissions-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-user-permissions-dialog.component.html',
  styleUrl: './view-user-permissions-dialog.component.scss'
})
export class ViewUserPermissionsDialogComponent {
    title!: string;
    message!: string;
    chunkedData: any[] = []; // Array to hold permission names in chunks.
  
    constructor(
      public dialogRef: MatDialogRef<ViewUserPermissionsDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any[]
    ) {}
  
    ngOnInit(): void {
      this.chunkedData = this.chunkArray(this.data, 4);
      console.log('Chunked Data:', this.chunkedData); // Debugging purpose
    }
  
    chunkArray(array: any[], chunkSize: number): any[] {
      const result = [];
      for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
      }
      return result;
    }
  
    onClose(val: any): void {
      this.dialogRef.close(val);
    }
  }