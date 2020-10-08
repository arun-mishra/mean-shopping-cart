import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { VerifyTokenService } from '../auth/verifyToken.service';

@Injectable()
export class AuthGuard implements CanActivate{
    isResAuth;
    constructor(private authService: AuthService, private router:Router,private verifyToken: VerifyTokenService){}
    canActivate(route: ActivatedRouteSnapshot, 
                state: RouterStateSnapshot ): boolean | Observable<boolean>| Promise <boolean> {

                   // this.verifyToken.verifyToken();
                    this.authService.isAuthenticated.subscribe(res=>{
                        this.isResAuth = res;
                    })
                    const isAuth = this.isResAuth
                    if(!isAuth){
                        this.authService.isAuthenticated.next(false)
                        this.router.navigate(['/']);
                        return false
                    }
                    return true;

    }
}