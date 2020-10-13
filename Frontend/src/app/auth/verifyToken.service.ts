import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { UIService } from '../shared/uiService.service';

@Injectable({providedIn:'root'})

export class VerifyTokenService {

    token:string;
    adminEmail:string = "admin@admin.com";

    constructor(private http: HttpClient,private authService:AuthService, 
                private router:Router, private uiService:UIService){}

    verifyUserToken(){
        this.token = localStorage.getItem('token')
        if(this.token){
          this.http.get<{email:string,userId:string}>('http://localhost:8080/auth/verifyUserToken').subscribe(res=>{
            if(!res.userId){
              this.authService.isAuthenticated.next(false);
              return;
            }
            const userId = localStorage.getItem('userId')
            if((userId === res.userId) && (res.email !== this.adminEmail)){
              this.authService.isAuthenticated.next(true);
        

            }else {
              this.authService.isAuthenticated.next(false);

            }
          },err=>{
            if(err.status===401){
              this.token =null
              this.authService.isAuthenticated.next(false)

              localStorage.removeItem('token')
              //this.uiService.showSnackBar('Authentication Failed, Try Login Again!!!',null,3000)
            }else{
              this.authService.isAuthenticated.next(false);

              //this.uiService.showSnackBar(err.error,null,3000)
            }
          })
          // this.isAuthenticated=true
          // this.authService.isAuthenticated.next(true);
          // this.router.navigate(['/fetch-post'])
        }else{
          this.authService.isAuthenticated.next(false)
        }
    }
    verifyAdminToken(){
      this.token = localStorage.getItem('token')
      if(this.token){
        this.http.get<{email:string,adminId:string}>('http://localhost:8080/auth/verifyAdminToken').subscribe(res=>{
         // console.log(res.email,res.adminId)
          if(!res.adminId){
             this.authService.isAdminAuthenticated.next(false);
             //this.authService.isAuthenticated.next(false)
             //this.router.navigate(['/']);
             return;
          }
          const adminId = localStorage.getItem('adminId')
          if((adminId === res.adminId) && (res.email == this.adminEmail)){
            this.authService.isAdminAuthenticated.next(true);
            this.authService.isAuthenticated.next(false)
          }else {
            this.authService.isAdminAuthenticated.next(false);
            //this.router.navigate(['/']);
          }
        },err=>{
          if(err.status===401){
            this.token =null
            this.authService.isAdminAuthenticated.next(false)
            //this.router.navigate(['/']);
            localStorage.removeItem('token')
            //this.uiService.showSnackBar('Authentication Failed, Try Login Again!!!',null,3000)
          }else{
            this.authService.isAdminAuthenticated.next(false);
            //this.router.navigate(['/']);
            //this.uiService.showSnackBar(err.error,null,3000)
          }
        })
        // this.isAuthenticated=true
        // this.authService.isAuthenticated.next(true);
        // this.router.navigate(['/fetch-post'])
      }else{
        this.authService.isAdminAuthenticated.next(false)
        //this.router.navigate(['/']);
      }
  }

   
}