import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { VerifyTokenService } from '../auth/verifyToken.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  title = 'Welcome to Online Shopping Market!';
  isAuthenticated:boolean= false;
  isAdminAuthenticated:boolean= false;

  constructor(private verifyTokenService:VerifyTokenService, private authService:AuthService,private http:HttpClient) { }

  ngOnInit(): void {
    
    const adminId = localStorage.getItem('adminId');
    const userId = localStorage.getItem('userId');
    console.log(adminId)
    if(adminId){
      this.verifyTokenService.verifyAdminToken();
    }
    else if(userId){
      this.verifyTokenService.verifyUserToken();
    }
   
    
    this.authService.isAuthenticated.subscribe(res=>{
      this.isAuthenticated=res
      console.log(this.isAuthenticated)
     
    })
    this.authService.isAdminAuthenticated.subscribe(res=>{
      this.isAdminAuthenticated = res
    })
     
  }
}
