import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class ApiService {
  token: string | undefined;
  userData: any;
  fcmToken: any;

  constructor(private http: HttpClient) {
  }

  login(data: any) {
    return this.http.post(`${environment.baseUrl}/admin_auth/login`, data);
  }
  verifyOTP(data: any) { 
    return this.http.post(`${environment.baseUrl}/admin_auth/verify_otp`, data);
  }
  createRole(data:any){
    return this.postApi('admin_role/add_role',data);
  }
  assignRoleToUser(data:any){
    console.log("api send data",data)
    return this.postApi('admin_user/add_user',data);
  }
  getAllPermissions(){
    return this.getApi('admin_permission/view_permission');
  }
  getUserDataByID(id:any){
    return this.getApi(`admin_user/view_user/${id}`);
  }
  getRoles(){
    return this.getApi('admin_role/all');
  }
  getRoleList(params: {
    page?: number, 
    limit?: number, 
    search?: string
  } = {}){
    return this.getApi('admin_role/view_role');
  }
  // getRoleList(params: {
  //   page?: number, 
  //   limit?: number, 
  //   search?: string
  // } = {}) {
  //   return this.http.get<any>('your-api-endpoint', { 
  //     params: {
  //       page: params.page?.toString() || '0',
  //       limit: params.limit?.toString() || '10',
  //       search: params.search || ''
  //     }
  //   });
  // }
  getUserList(params: {
    page?: number, 
    limit?: number, 
    search?: string
  } = {}){
    return this.getApi('admin_user/view_user');
  }
  getRoleByID(id:any){
    return this.getApi(`admin_role/view_role/${id}`);
  }
  updateUser(id:any, data:any){
    return this.putApi(`admin_user/edit_user/${id}`,data);
  }
  updateRole(id:any, data:any){
    return this.putApi(`admin_role/edit_role/${id}`,data);
  }
  deleteRole(id:any){
    return this.deleteApi(`admin_role/delete_role/${id}`);
  }
  deleteUser(id:any){
    return this.deleteApi(`admin_user/delete_user/${id}`);
  }
  getApi(url: string): Observable<any> {
    return this.http.get(`${environment.baseUrl}${url}`);
  }
  postApi(url: any, data: any) {
    return this.http.post(`${environment.baseUrl}${url}`, data);
  }
  putApi(url: any, data: any) {
    return this.http.put(`${environment.baseUrl}${url}`, data);
  }
  postUpdateApi(url: any) {
    return this.http.post(`${environment.baseUrl}${url}`, {});
  }
  deleteApi(url: string): Observable<any> {
    return this.http.delete(`${environment.baseUrl}${url}`);
  }
}
