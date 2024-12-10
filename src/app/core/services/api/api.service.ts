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
    this.getLocalStorageData();
  }
  
  getLocalStorageData(): Observable<any> {
    const userData = JSON.parse(localStorage.getItem('user_data') || 'null');
    console.log('hello data', userData);
    return of(userData);
  }
 
  login(data: any) {
    return this.http.post(`${environment.baseUrl}/auth/login`, data);
  }
  verifyOTP(data: any) { 
    return this.http.post(`${environment.baseUrl}/auth/verify-otp`, data);
  }
  createRole(data:any){
    return this.postApi('role/create',data);
  }
  assignRoleToUser(data:any){
    console.log("api send data",data)
    return this.postApi('user/add',data);
  }
  getAllPermissions(){
    return this.getApi('permission/all');
  }
  getRoles(){
    return this.getApi('role/all');
  }
  getRoleList(){
    return this.getApi('role/get');
  }
  getRoleByID(id:any){
    return this.getApi(`role/get/${id}`);
  }
  updateRole(id:any, data:any){
    console.log("update data--",data)
    return this.putApi(`role/update/${id}`,data);
  }
  deleteRole(id:any){
    return this.deleteApi(`role/delete/${id}`);
  }
  getHttpHeaders() {
    const data = JSON.parse(localStorage.getItem('user_data') || '{}');
    console.log("data?.user.token",data.data?.token)
    if (data.data?.token) {
      this.token = data.data?.token;
    } else if (data) {
      this.token = data.data?.token;
    }

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
      }),
    };
  }
  getApi(url: string): Observable<any> {
    return this.http.get(`${environment.baseUrl}${url}`, this.getHttpHeaders());
  }
  postApi(url: any, data: any) {
    return this.http.post(`${environment.baseUrl}${url}`, data, this.getHttpHeaders());
  }
  putApi(url: any, data: any) {
    return this.http.put(`${environment.baseUrl}${url}`, data, this.getHttpHeaders());
  }
  postUpdateApi(url: any) {
    return this.http.post(`${environment.baseUrl}${url}`, {}, this.getHttpHeaders());
  }
  deleteApi(url: string): Observable<any> {
    return this.http.delete(`${environment.baseUrl}${url}`, this.getHttpHeaders());
  }
}
