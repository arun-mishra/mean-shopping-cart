import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { UIService } from 'src/app/shared/uiService.service';

@Component({
    selector: 'app-signup',
    templateUrl:'./signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{
  signup:FormGroup;
  onLoadingState=false;

  @ViewChild(FormGroupDirective) formGroupDirective:FormGroupDirective

  constructor(private authService:AuthService,private uiService:UIService) {}

  ngOnInit() {
    this.signup=new FormGroup({
      'email':new FormControl(null,[Validators.required]),
      'password':new FormControl(null,[Validators.required,Validators.minLength(8)])
    })
    this.uiService.isSignupLoadingState.subscribe(res=>{
      this.onLoadingState=res;
    })
  
  }

  onSubmit(){
    this.onLoadingState=true;
    const email = this.signup.value.email;
    const password = this.signup.value.password;
    console.log(email,password)
    this.authService.createUser(email,password)
    this.signup.reset();
    setTimeout(() => this.formGroupDirective.resetForm(), 0)
       
}

}