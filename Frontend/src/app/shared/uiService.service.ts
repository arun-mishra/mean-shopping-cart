import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn:'root'
})
export class UIService{
    isLoadingState=new Subject<boolean>();
    isSignupLoadingState=new Subject<boolean>();
    isLoginLoadingState=new Subject<boolean>();
    constructor(private _snackBar:MatSnackBar){}
    showSnackBar(message,action,duration){
        this._snackBar.open(message,action,{duration:duration});
    }
    

}