import { Component, OnInit  } from '@angular/core';
import { AuthService } from './auth/auth.service';

import { Router } from '@angular/router';
import { UIService } from './shared/uiService.service';
import { VerifyTokenService } from './auth/verifyToken.service';

const SOCKET_ENDPOINT = "http://localhost:3000";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Welcome to Heaven!';
  isAuthenticated:boolean =false;
  isAdminAuthenticated: boolean = false;
  
  constructor(private authService:AuthService,private router:Router,private uiService:UIService,
              private verifyTokenService:VerifyTokenService){}

  ngOnInit(){
    const adminId = localStorage.getItem('adminId');
    console.log(adminId)
    if(adminId){
      this.verifyTokenService.verifyAdminToken();
    }
    else{
      this.verifyTokenService.verifyUserToken();
    }
   
    this.authService.isAuthenticated.subscribe(res=>{
      this.isAuthenticated = res
    })
    this.authService.isAdminAuthenticated.subscribe(res=>{
      this.isAdminAuthenticated = res
    })
  
  }

  onLogout(){
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
  localStorage.removeItem('adminId')
  this.authService.isAuthenticated.next(false);
  this.authService.isAdminAuthenticated.next(false);
  this.router.navigate(['/'])
  this.uiService.showSnackBar('Successfully Logged Out!!!',null,3000)
  }
  
     
 
  
}

