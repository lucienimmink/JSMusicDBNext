import { Observable, throwError as observableThrowError } from "rxjs";

// import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";

@Injectable()
export class LoginService {
  public hasToken = false;

  constructor(private http: HttpClient) {
    if (localStorage.getItem("jwt")) {
      this.hasToken = true;
    }
  }

  public doLogin(form: any, encoded: boolean = false): any {
    const username = form.name;
    const password = form.password;

    const payload = form;
    if (!encoded) {
      throw new Error("You should log in via the webcrypto flow; contact me");
      /*
      localStorage.setItem("dsm", form.dsmport);
      payload = this.encode(form);
      */
    }

    const headers = new HttpHeaders({
      "X-Cred": payload,
    });

    const options = {
      headers,
    };

    return this.http
      .post(`${localStorage.getItem("dsm")}/login`, null, options)
      .pipe(catchError(this.handleError));
  }
  public autoLogin() {
    const cred = localStorage.getItem("jwt");
    if (cred) {
      return this.doLogin(cred, true);
    } else {
      localStorage.removeItem("jwt");
      return observableThrowError(null);
    }
  }
  /*
  public encode(payload: any): string {
    return KJUR.jws.JWS.sign(
      "HS256",
      { alg: "HS256", typ: "JWT" },
      payload,
      "jsmusicdbnext"
    );
  }
  */
  public versionCheck(url: string) {
    return this.http.get(`${url}/version`);
  }
  public getPublicKey(url: string) {
    return this.http.get(`${url}/public-key`);
  }
  public authenticate(url: string, encryptedPayload: ArrayBuffer) {
    return this.http.post(`${url}/authenticate`, {
      encryptedPayload: this.arrayBufferToBase64(encryptedPayload)
    });
  }
  private handleError(error: any) {
    return observableThrowError(null);
  }
  private arrayBufferToBase64(buffer) {
    return btoa(
      new Uint8Array(buffer).reduce((data, byte) => {
        return data + String.fromCharCode(byte);
      }, "")
    );
  }
}
