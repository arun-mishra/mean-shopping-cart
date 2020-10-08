import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { UIService } from 'src/app/shared/uiService.service';
import { AuthService } from '../auth.service';

@Component({
    selector:'app-admin-auth',
    templateUrl:'./adminAuth.component.html',
    styleUrls: ['./adminAuth.component.css']
})
export class AdminAuthComponent{
    login:FormGroup;
    isLogin=false;
    //userName:Post[]=[];
    progress=0;
    timer:any;
    onLoadingState=false;
    isStudentAuthenticated:boolean;
    isAuthenticated:boolean;
  
    @ViewChild(FormGroupDirective) formGroupDirective:FormGroupDirective
  
  
  constructor(private authService:AuthService, private uiService:UIService) { }
  
  ngOnInit(){
    this.login=new FormGroup({
      'email': new FormControl(null,[Validators.required]),
      'password':new FormControl(null,[Validators.required,Validators.minLength(8)])
    })
    this.uiService.isLoadingState.subscribe(res=>{
      this.onLoadingState=res
    })
  
  }
  
  onSubmit(){
      
    this.onLoadingState=true;
    const email = this.login.value.email;
    const password = this.login.value.password;
    console.log(email,password)
    this.authService.adminLogin(email,password)
    this.login.reset();
    setTimeout(() => this.formGroupDirective.resetForm(), 0)
  
  }
  

}