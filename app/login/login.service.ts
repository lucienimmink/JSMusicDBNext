import { Injectable } from "@angular/core";
import { Http, Response, URLSearchParams, RequestOptionsArgs } from "@angular/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class LoginService {

  constructor(private http: Http) {}

  doLogin(form: any) {
    let username = form.name;
    let password = form.password;
    let dsmport = form.dsmport;

    let protocol = document.location.protocol;
    let hostname = document.location.hostname;

    let urlSearchParams: URLSearchParams = new URLSearchParams();
    urlSearchParams.set('account', username);
    urlSearchParams.set('passwd', password);
    urlSearchParams.set('api', 'SYNO.API.Auth');
    urlSearchParams.set('version', '3');
    urlSearchParams.set('method', 'login');
    urlSearchParams.set('session', 'AudioStation');

    let query: RequestOptionsArgs = {
      search: urlSearchParams
    };

    return this.http.get(`${protocol}//${hostname}:${dsmport}/webapi/auth.cgi`, query)
      .map(this.handleLogin)
      .catch(this.handleError);

  }
  private handleLogin(res: Response) {
    let json = res.json();
    console.log(res);
    return json;
  }


  private handleError(error: any) {
    console.log('error', error);
    return Observable.throw(null);
  }
}