import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from './../login/login.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve) => {
      const url: string = state.url;
      window.scrollTo(0, 0); // scroll to top on every change;
      resolve(this.checkLogin(url));
    });
  }

  public checkLogin(url: string): boolean {
    if (localStorage.getItem('jwt')) {
      // we have either logged in via the login service ór we have a token and have logged in before
      return true;
    }

    // if not we need a new login to create a fresh token
    this.router.navigate(['/login']);
    return false;
  }
}
