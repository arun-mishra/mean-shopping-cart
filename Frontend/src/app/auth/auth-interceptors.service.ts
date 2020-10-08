import { HttpInterceptor, HttpRequest, HttpHandler, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor{
    userId:string;
    token:string;
    constructor(private authService:AuthService,private http: HttpClient){}

    intercept(req:HttpRequest<any>,next:HttpHandler){

        let token = this.authService.getToken();
        if(!token){
            token = localStorage.getItem('token');
            if(!token){
                return next.handle(req)
            }
        }
      
        const request = req.clone({
            headers:req.headers.set('Authorization','Bearer '+ token)
        });
        return next.handle(request)
    }
}