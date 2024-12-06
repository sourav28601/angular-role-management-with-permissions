import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule,FormBuilder, FormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Router, ActivatedRoute} from '@angular/router';
import { ApiService } from 'src/app/core/services/api/api.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-role',
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
    MatTableModule
  ],
  templateUrl: './edit-role.component.html',
  styleUrl: './edit-role.component.scss'
})
export class EditRoleComponent {
  
  roleForm: UntypedFormBuilder | any;
  isSubmitted: boolean = false;
  categoryId: any;
  hasPicture: boolean = false;
  imagePreview!: string;
  hasIcon: boolean = false;
  iconPreview!: string;
  permissionData: any;
  permisson_obj: any;
  checkedpermissionData: any;
  allComplete: boolean = false;
  permissionIds: any = [];
  allPermissions: any = [];
  roleNames: any = [];

  get formControls() { return this.roleForm.controls }

  constructor(
      private formBuilder: UntypedFormBuilder,
      public apiService: ApiService,
      private router: Router,
      private activateRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
      this.roleForm = this.formBuilder.group({
          name: ['', Validators.required],
      });
      this.categoryId = this.activateRoute.snapshot.paramMap.get('id');
      this.getRole()
      this.getAllPermission();
  }

  getRole() {
      this.apiService.getRoleByID(this.categoryId).subscribe((respData: any) => {
          // this.apiService.setLoader(false);
          // if (respData?.isError == false) {
            console.log("this.categoryId-----------",this.categoryId)
            console.log("respData",respData.data.Permissions)
              this.setValue(respData?.data);
              respData.data.Permissions.forEach((per: any) => {
                  this.permissionIds.push(per.id);
                  if (this.roleNames.indexOf(per.permissionName) === -1) {
                      this.roleNames.push(per.permissionName);
                  }
              });

          // } else {
              // this.toastrService.showError(respData?.message, 'Error');
          // }
      }, (err) => {
          // this._authService.setLoader(false);
          // this.toastrService.showError(err.error.message, 'Error');
      });

  }

  getAllPermission() {
      // this._authService.setLoader(true);
      this.apiService.getAllPermissions().subscribe((respData: any) => {
          // this._authService.setLoader(false);
          respData.data.map((res: any) => {
              res.completed = false;
              res.permissionType = res.permissionType.toLowerCase() == 'get' ? 'view' : res.permissionType;
          })
          this.permissionData = respData.data;
          console.log(" this.permissionData ", this.permissionData )

          // if (respData?.isError == false) {
              this.permissionData.map((p:any)=>{
                  if (this.permissionIds.includes(p.id)) {
                      p.completed = true
                  }
              });

              this.permisson_obj = this.groupBy(respData.data, 'permissionName');
              this.permisson_obj = Object.entries(this.permisson_obj);
          // }
      }, (err) => {
        console.log("err---",err)
          // this._authService.setLoader(false);
          // this.toastrService.showError(err.message, 'Error');
      });
  }

  setAll(completed: boolean, data: any) {

      this.checkedpermissionData = this.permisson_obj.filter((p: any) => p[0] == data);

      this.allComplete = completed;

      if (this.checkedpermissionData[0][1] == null) {
          return;
      }
      this.checkedpermissionData[0][1].forEach((t: any) => (t.completed = completed));
  }

  updateAllComplete() {
      this.allComplete = this.checkedpermissionData != null && this.checkedpermissionData.every((t: any) => t.completed);
  }

  someComplete(): boolean {

      if (this.checkedpermissionData == null) {
          return false;
      }
      return this.checkedpermissionData.filter((t: any) => t.completed).length > 0 && !this.allComplete;
  }

  setValue(formValue: any) {
    console.log("formValue",formValue)
      this.roleForm.controls["name"].setValue(formValue.name);
  }

  onSubmit() {
    this.isSubmitted = true;
    this.allPermissions = [];

    // Collect all completed permissions
    this.permissionData.filter((p: any) => {
        if (p.completed) {
            this.allPermissions.push(p.id);
        }
    });

    this.roleForm.value.permission_id = this.allPermissions;
    console.log("this.categoryId-----------", this.categoryId);
    // Update role API call
    this.apiService.updateRole(this.categoryId, this.roleForm.value).subscribe(
        (respData: any) => {
            console.log("update respData", respData);
            // Display success SweetAlert
            Swal.fire({
                title: 'Success!',
                text: 'Role updated successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                this.router.navigate(['/ui-components/role-list']);
            });
        },
        (err) => {
            console.log("err----", err);
            // Display error SweetAlert if something goes wrong
            Swal.fire({
                title: 'Error!',
                text: 'There was an error updating the role. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    );
}


  groupBy(obj: any, prop: any) {
      return obj.reduce((acc: any, item: any) => {
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
}
