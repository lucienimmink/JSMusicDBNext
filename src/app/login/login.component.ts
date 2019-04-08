import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

import { CollectionService } from "./../utils/collection.service";
import { ConfigService } from "./../utils/config.service";
import { CoreService } from "./../utils/core.service";
import { LoginService } from "./login.service";

import { User } from "./user";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html"
})
export class LoginComponent implements OnInit, OnDestroy {
  public user: User;
  public theme: string;
  public isLoading = false;
  private payLoad: any;
  private subscription: Subscription;
  private sid: string;

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
  public onSubmit() {
    this.payLoad = JSON.stringify(this.user);
    this.loginService.doLogin(this.user).subscribe(
      data => {
        if (data.success) {
          localStorage.setItem("jwt", this.loginService.encode(this.payLoad)); // save creds in storage
          this.getCollection();
        }
      },
      error => {
        console.error("session failed; bah");
      }
    );
  }

  public getCollection() {
    this.isLoading = true;
    this.collectionService.getCollection().subscribe(data => this.fillCollection(data), error => console.error(error));
  }
  public fillCollection(data: any): void {
    this.coreService.getCore().parseSourceJson(data);
    this.router.navigate(["/home"]);
  }
}
