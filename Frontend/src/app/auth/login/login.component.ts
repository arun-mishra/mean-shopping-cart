import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UIService } from 'src/app/shared/uiService.service';

@Component({
    selector:'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent{
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
  this.authService.loginUser(email,password)
  this.login.reset();
  setTimeout(() => this.formGroupDirective.resetForm(), 0)

}

}