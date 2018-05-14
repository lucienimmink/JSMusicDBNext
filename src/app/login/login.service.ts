import { throwError as observableThrowError, Observable } from "rxjs";

import { catchError, map } from "rxjs/operators";
import { Injectable } from "@angular/core";
// import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { KJUR } from "jsrsasign";

@Injectable()
export class LoginService {
  public hasToken = false;

  constructor(private http: HttpClient) {
    if (localStorage.getItem("jwt")) {
      this.hasToken = true;
    }
  }

  doLogin(form: any, encoded: boolean = false): any {
    const username = form.name;
    const password = form.password;

    let payload = form;
    if (!encoded) {
      localStorage.setItem("dsm", form.dsmport);
      payload = this.encode(form);
    }

    const headers = new HttpHeaders({
      "X-Cred": payload
    });

    const options = {
      headers: headers
    };

    return this.http
      .post(`${localStorage.getItem("dsm")}/login`, null, options)
      .pipe(catchError(this.handleError));
  }
  autoLogin() {
    const cred = localStorage.getItem("jwt");
    if (cred) {
      return this.doLogin(cred, true);
    } else {
      localStorage.removeItem("jwt");
      return observableThrowError(null);
    }
  }
  encode(payload: any): string {
    return KJUR.jws.JWS.sign(
      "HS256",
      JSON.stringify({ alg: "HS256", typ: "JWT" }),
      JSON.stringify(payload),
      "jsmusicdbnext"
    );
  }
  private handleError(error: any) {
    return observableThrowError(null);
  }
}
