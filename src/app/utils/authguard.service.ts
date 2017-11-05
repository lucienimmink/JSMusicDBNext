import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoginService } from './../login/login.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    window.scrollTo(0, 0); // scroll to top on every change;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if (localStorage.getItem("jwt")) {
      // we have either logged in via the login service ór we have a token and have logged in before 
      return true;
    }

    // if not we need a new login to create a fresh token
    this.router.navigate(['/login']);
    return false;
  }
}
