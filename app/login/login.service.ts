import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class LoginService {

  constructor(private http: Http) { }

  doLogin(form: any) {
    let username = form.name;
    let password = form.password;
    let streamerUrl = form.dsmport;

    return this.http.post(`${streamerUrl}/login`, {
      account: username,
      passwd: password
    })
      .map(this.handleLogin)
      .catch(this.handleError);

  }
  autoLogin() {
    let cred = JSON.parse(localStorage.getItem("jwt"));
    if (cred) {
      return this.doLogin(cred);
    } else {
      localStorage.removeItem('jwt');
      return Observable.throw(null);
    }
  }
  private handleLogin(res: Response) {
    let json = res.json();
    return json;
  }

  private handleError(error: any) {
    return Observable.throw(null);
  }
}