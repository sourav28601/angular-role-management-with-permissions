import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { OnInit, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api/api.service';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-view-post-review-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
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
  ],
  templateUrl: './view-post-review-detail.component.html'
})
export class ViewPostReviewDetailComponent {
  postForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ViewPostReviewDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    console.log("data----",data)
    this.postForm = this.fb.group({
      type: [''],
      channel: [''],
      status: [''],
      remarks: [''],
      mediaFile: ['']
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.postForm.patchValue({
      mediaFile: file
    });
  }

  ngOnInit(): void {
    // Populate form with existing data
    this.postForm.patchValue({
      type: this.data.type,
      channel: this.data.channel,
      status: this.data.status || '',
      remarks: this.data.remarks || ''
    });
  }

  onSubmit() {
    if (this.postForm.valid) {
      this.dialogRef.close(this.postForm.value);
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}