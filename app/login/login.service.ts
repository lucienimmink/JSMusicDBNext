import { Injectable } from "@angular/core";
import { Http, Response, URLSearchParams, RequestOptionsArgs } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class LoginService {

  constructor(private http: Http) { }

  public isLoggedIn: boolean = false;

  doLogin(form: any) {
    let username = form.name;
    let password = form.password;
    let dsmport = form.dsmport;

    let protocol = document.location.protocol;
    let hostname = document.location.hostname;

    return this.http.post(`${protocol}//${hostname}:${dsmport}/login`, {
      account: username,
      passwd: password
    })
      .map(this.handleLogin)
      .catch(this.handleError);

  }
  autoLogin(cred) {
    return this.doLogin(cred);
  }
  private handleLogin(res: Response) {
    let json = res.json();
    this.isLoggedIn = true;
    return json;
  }

  private handleError(error: any) {
    this.isLoggedIn = false;
    return Observable.throw(null);
  }
}