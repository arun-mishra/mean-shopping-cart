import { UIService } from '../shared/uiService.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface AuthData{
    email:string;
    password:string;
  }

@Injectable({providedIn:'root'})

export class AuthService{
    isAuthenticated = new Subject<boolean>();
    isAdminAuthenticated = new Subject<boolean>();
    token:string;

    constructor(private uiService:UIService, private http:HttpClient, private router:Router){}

    createUser(email:string,password:string){
        console.log(email,password)
        const authData: AuthData= { email:email , password:password }

        this.http.post<{message:string,user:string}>("http://localhost:8080/auth/signup",authData)
        .subscribe(response=>{
            console.log(response)
            if(response.user){
                this.uiService.showSnackBar('Successfully Signed Up',null,3000);
                this.uiService.isSignupLoadingState.next(false)
                this.router.navigate(['/auth/login']);
            }
        },err=>{
            console.log(err)
            if(err.status == 400){
                
                this.uiService.showSnackBar('This user already exists!!!',null,3000)
                this.uiService.isSignupLoadingState.next(false)
            }else
            if(err.status ===422){
                
                this.uiService.showSnackBar('Validation Failed!!!',null,3000)
                this.uiService.isSignupLoadingState.next(false)
            }
            else{
               
                this.uiService.showSnackBar('An unknown error occurred!!',null,3000)
                this.uiService.isSignupLoadingState.next(false)
            }
        }
        
        )
        
        
    }

    loginUser(email:string, password:string){
        const authData:AuthData ={ email:email, password:password }
        this.http.post<{token:string,userId:string}>('http://localhost:8080/auth/login',authData)
        .subscribe(response=>{
            console.log(response);
            const token = response.token;
            const userId = response.userId;
            this.token = token;
            localStorage.setItem('token',token)
            localStorage.setItem('userId',userId)
            if(this.token){
                this.uiService.isLoadingState.next(false)
                this.isAuthenticated.next(true);
                this.router.navigate(['/shop'])
                this.uiService.showSnackBar('Successfully LoggedIn',null,3000);
                
            }
            else if(!this.token){
                this.uiService.isLoadingState.next(false)
                this.isAuthenticated.next(false);
                this.isAdminAuthenticated.next(false);
                this.uiService.showSnackBar('Failed to Log In',null,3000);
                this.router.navigate(['/'])
            }
            
        },err=>{
            if(err.status == 401){
                this.uiService.isLoadingState.next(false);
                this.isAdminAuthenticated.next(false);
                this.isAuthenticated.next(false)
                this.uiService.showSnackBar(err.error,null,3000)
            }
            else{
                this.uiService.isLoadingState.next(false)
                this.isAuthenticated.next(false);
                this.isAdminAuthenticated.next(false);
                this.uiService.showSnackBar('An unknown error occurred!',null,3000)
            }
        })
        
    }

    adminLogin(email:string, password:string){
        const authData:AuthData ={ email:email, password:password }
        this.http.post<{token:string,adminId:string}>('http://localhost:8080/auth/admin',authData)
        .subscribe(response=>{
            console.log(response);
            const token = response.token;
            const adminId = response.adminId;
            this.token = token;
            localStorage.setItem('token',token)
            localStorage.setItem('adminId',adminId)
            if(this.token){
                this.uiService.isLoadingState.next(false)
                this.isAdminAuthenticated.next(true);
                this.router.navigate(['/shop'])
                this.uiService.showSnackBar(' Admin Successfully LoggedIn',null,3000);
                
            }
            else if(!this.token){
                this.uiService.isLoadingState.next(false)
                this.isAuthenticated.next(false);
                this.isAdminAuthenticated.next(false);
                this.uiService.showSnackBar('Failed to Log In',null,3000);
                this.router.navigate(['/'])
            }
            
        },err=>{
            if(err.status == 401){
                this.uiService.isLoadingState.next(false)
                this.isAuthenticated.next(false)
                this.isAdminAuthenticated.next(false);
                this.uiService.showSnackBar(err.error,null,3000)
            }
            else{
                this.uiService.isLoadingState.next(false)
                this.isAuthenticated.next(false);
                this.isAdminAuthenticated.next(false);
                this.uiService.showSnackBar('An unknown error occurred!',null,3000)
            }
        })
        
    }


    getToken(){
        return this.token;
    }
}