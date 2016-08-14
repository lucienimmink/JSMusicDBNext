import { Injectable } from "@angular/core";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { KJUR } from "jsrsasign";

@Injectable()
export class LoginService {

  constructor(private http: Http) { }

  doLogin(form: any, encoded:boolean = false) {
    let username = form.name;
    let password = form.password;

    let payload = form;
    if (!encoded) {
      localStorage.setItem('dsm', form.dsmport);
      payload = this.encode(form);
    }

    // add as header
    let headers = new Headers();
    headers.append('X-Cred', payload);
    let requestOptions = new RequestOptions();
    requestOptions.headers = headers;

    return this.http.post(`${localStorage.getItem('dsm')}/login`, {}, requestOptions)
      .map(this.handleLogin)
      .catch(this.handleError);

  }
  autoLogin() {
    let cred = localStorage.getItem("jwt");
    if (cred) {
      return this.doLogin(cred, true);
    } else {
      localStorage.removeItem('jwt');
      return Observable.throw(null);
    }
  }
  encode(payload:any):string {
    return KJUR.jws.JWS.sign("HS256", JSON.stringify({ alg: 'HS256', typ: 'JWT' }), JSON.stringify(payload), 'jsmusicdbnext');
  }
  private handleLogin(res: Response) {
    let json = res.json();
    return json;
  }

  private handleError(error: any) {
    return Observable.throw(null);
  }
}