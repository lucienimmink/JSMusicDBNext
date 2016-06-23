import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class LoginService {

  constructor(private http: Http) { }

  doLogin(form: any) {
    let username = form.name;
    let password = form.password;
    let dsmport = form.dsmport;

    //let protocol = document.location.protocol;
    //let hostname = document.location.hostname;
    let protocol = 'http:';
    let hostname = 'www.arielext.org'

    return this.http.post(`${protocol}//${hostname}:${dsmport}/login`, {
      account: username,
      passwd: password
    })
      .map(this.handleLogin)
      .catch(this.handleError);

  }
  autoLogin() {
    let cred = JSON.parse(localStorage.getItem("jwt"));
    return this.doLogin(cred);
  }
  private handleLogin(res: Response) {
    let json = res.json();
    return json;
  }

  private handleError(error: any) {
    return Observable.throw(null);
  }
}