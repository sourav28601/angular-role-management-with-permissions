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
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api/api.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-role',
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
  templateUrl: './create-role.component.html',
  styleUrl: './create-role.component.scss'
})

export class CreateRoleComponent {
  roleForm: UntypedFormBuilder | any;
  isSubmitted: boolean = false;
  allPermissions: any = [];
  permisson_obj: any;
  allComplete: boolean = false;
  checkedpermissionData: any;
  permissionData: any;
  snackBar: any;

  constructor(
      private formBuilder: UntypedFormBuilder,
      public apiService: ApiService,
      private router: Router,
  ) { }

  ngOnInit(): void {
      this.roleForm = this.formBuilder.group({
          name: ['', Validators.required],
          permission_id: ['', Validators.required],
      });
      this.getAllPermission();
  }
  get formControls() { return this.roleForm.controls }

  getAllPermission() {
      this.apiService.getAllPermissions().subscribe((respData: any) => {
        console.log("respData",respData.data)
          respData.data.map((res: any) => {
            console.log("res-----",res)
              res.completed = false;
              res.permissionType = res.permissionType.toLowerCase() == 'get' ? 'view' : res.permissionType;
          })
          this.permissionData = respData.data;
          console.log("permissionData----",this.permissionData)
          // if (respData?.isError == false) {
              this.permisson_obj = this.groupBy(respData.data, 'permissionName');
              this.permisson_obj = Object.entries(this.permisson_obj);
              console.log("this.permisson_obj--",this.permisson_obj)
          // }
      }, (err) => {
        console.log("err--",err)
          // this.apiService.setLoader(false);
          // this.toastrService.showError(err.message, 'Error');
      });
  }


  onSubmit() {    
    this.isSubmitted = true;    
    this.allPermissions = [];    

    this.permissionData.filter((p: any) => {        
        if (p.completed) {            
            this.allPermissions.push(p.id);        
        }    
    });

    this.roleForm.value.permission_id = this.allPermissions;    
    console.log("this.roleForm.value--", this.roleForm.value);

    this.apiService.createRole(this.roleForm.value).subscribe(        
        (respData: any) => {            
            Swal.fire({                
                title: 'Success!',                
                text: 'Role created successfully.',                
                icon: 'success',                
                confirmButtonText: 'OK'            
            }).then(() => {                
                this.router.navigate(['/ui-components/role-list']);            
            });        
        },        
        (err) => {            
            Swal.fire({                
                title: 'Error!',                
                text: 'There was an error creating the role. Please try again.',                
                icon: 'error',                
                confirmButtonText: 'OK'            
            });        
        }    
    ); 
}


  
  setAll(completed: boolean,data:any) {
      this.checkedpermissionData = this.permisson_obj.filter((p:any)=> p[0] == data );
              
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

  // roleForm: FormGroup;
  // permissions: any;
  // selectedPermissions: number[] = [];
  // Object: any;
  

  // constructor(
  //   private fb: FormBuilder,
  //   private apiService: ApiService,
  //   private snackBar: MatSnackBar,
  //   private router: Router
  // ) {
  //   this.roleForm = this.fb.group({
  //     name: ['', [Validators.required, Validators.minLength(3)]],
  //     description: ['', [Validators.required, Validators.minLength(5)]]
  //   });
  // }

  // ngOnInit() {
  //   this.loadPermissions();
  // }

  // loadPermissions() {
  //   this.apiService.getAllPermissions().subscribe({
  //     next: (response: any) => {
  //       const groupedPermissions = response.data.reduce((groups: any, permission: any) => {
  //         if (!groups[permission.permissionName]) {
  //           groups[permission.permissionName] = [];
  //         }
  //         groups[permission.permissionName].push(permission);
  //         return groups;
  //       }, {});
  //       this.permissions = groupedPermissions;
  //       console.log("Grouped Permissions: ", this.permissions);
  //     },
  //     error: (err) => {
  //       console.log("Error: ", err);
  //       this.snackBar.open('Error loading permissions', 'Close', { duration: 3000 });
  //     }
  //   });
  // }
  

  // onPermissionChange(permissionId: number, checked: any) {
  //   if (checked) {
  //     this.selectedPermissions.push(permissionId);
  //   } else {
  //     this.selectedPermissions = this.selectedPermissions.filter(id => id !== permissionId);
  //   }
  // }

  // onSubmit() {
  //   if (this.roleForm.valid && this.selectedPermissions.length > 0) {
  //     const roleData = {
  //       ...this.roleForm.value,
  //       permission_id: this.selectedPermissions
  //     };

  //     this.apiService.createRole(roleData).subscribe({
  //       next: (response) => {
  //         this.snackBar.open('Role created successfully', 'Close', { duration: 3000 });
  //         this.router.navigate(['/dashboard']);
  //       },
  //       error: (err) => {
  //         this.snackBar.open(err.message || 'Error creating role', 'Close', { duration: 3000 });
  //       }
  //     });
  //   } else {
  //     this.snackBar.open('Please fill all required fields and select at least one permission', 'Close', { duration: 3000 });
  //   }
  // }

  // onCancel() {
  //   this.router.navigate(['/roles']);
  // }

}


