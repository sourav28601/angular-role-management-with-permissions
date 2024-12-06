import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-view-permissions-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-permissions-dialog.component.html',
  styleUrl: './view-permissions-dialog.component.scss'
})
export class ViewPermissionsDialogComponent {
  title!: string;
  message!: string;
  sortedData: [] = [];

  constructor(public dialogRef: MatDialogRef<ViewPermissionsDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit(): void {
      this.data = this.groupBy(this.data, 'permissionName');
      this.data = Object.entries(this.data);
  }

  groupBy(obj: any, prop: any) {
      return obj.reduce(function (acc: any, item: any) {
          let key = item[prop];
          if (typeof key === "string") {
              key = key.replace(/\s+/g, "");
          }
          if (!acc[key]) {
              acc[key] = [];
          }
          acc[key].push(item);
          return acc;
      }, {});
  }

  onClose(val: any): void {
      this.dialogRef.close(val);
  }
}
