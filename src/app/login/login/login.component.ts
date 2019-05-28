import { Component, Input, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import semver from "semver";

import { CollectionService } from "./../../utils/collection.service";
import { ConfigService } from "./../../utils/config.service";
import { CoreService } from "./../../utils/core.service";
import { LoginService } from "./../login.service";

import { User } from "./../user";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html"
})
export class LoginComponent implements OnDestroy {
  private static readonly MINIMALSTREAMVERSION: string = "4.0.0";
  public user: User;
  public theme: string;
  public isLoading = false;
  public minimalVersion: string = LoginComponent.MINIMALSTREAMVERSION;
  private payLoad: any;
  private subscription: Subscription;
  private sid: string;
  private lowVersion: boolean = false;
  private noVersion: boolean = false;
  private loginFail: boolean = false;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private collectionService: CollectionService,
    private coreService: CoreService,
    private configService: ConfigService
  ) {
    this.user = new User();

    this.subscription = this.configService.mode$.subscribe(data => {
      this.theme = data;
    });
    this.theme = configService.mode;
  }
  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  public async onSubmit() {
    /*
    this.payLoad = JSON.stringify(this.user);
    this.loginService.doLogin(this.user).subscribe(
      async data => {
        if (data.success) {
          const jwt = await this.loginService.encode(this.payLoad);
          localStorage.setItem("jwt", jwt); // save creds in storage
          this.getCollection();
        }
      },
      error => {
        console.error("session failed; bah");
      }
    );
    */
    this.lowVersion = false;
    this.noVersion = false;
    this.loginFail = false;
    // check version
    this.loginService.versionCheck(this.user.dsmport).subscribe(
      async data => {
        if (
          // @ts-ignore
          data.version &&
          // @ts-ignore
          semver.satisfies(data.version, LoginComponent.MINIMALSTREAMVERSION)
        ) {
          this.loginService
            .getPublicKey(this.user.dsmport)
            .subscribe(async key => {
              const encryptedArrayBuffer = await this.encryptPayload(
                this.user,
                key
              );
              this.loginService
                .authenticate(this.user.dsmport, encryptedArrayBuffer)
                .subscribe(
                  auth => {
                    // @ts-ignore
                    const jwt = auth.jwt;
                    localStorage.setItem("jwt", jwt); // save creds in storage
                    localStorage.setItem("dsm", this.user.dsmport);
                    this.getCollection();
                  },
                  error => {
                    this.loginFail = true;
                  }
                );
            });
          return;
        }
        this.lowVersion = true;
      },
      error => {
        this.noVersion = true;
      }
    );
  }
  public getCollection() {
    this.isLoading = true;
    this.collectionService
      .getCollection()
      .subscribe(
        data => this.fillCollection(data),
        error => console.error(error)
      );
  }
  public fillCollection(data: any): void {
    this.coreService.getCore().parseSourceJson(data);
    this.router.navigate(["/home"]);
  }

  private async encryptPayload(user: any, key: any) {
    const encryptionKey = await crypto.subtle.importKey(
      "jwk",
      key,
      {
        name: "RSA-OAEP",
        hash: "SHA-256"
      },
      false,
      ["encrypt"]
    );
    const payload = new TextEncoder().encode(JSON.stringify(user));
    const encrypted = await crypto.subtle.encrypt(
      {
        name: "RSA-OAEP"
      },
      encryptionKey,
      payload
    );
    return encrypted;
  }
}
