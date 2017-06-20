import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { LoginService } from './login.service';
import { Router } from "@angular/router";
import { CollectionService } from './../collection.service';
import { CoreService } from './../core.service';
import { ConfigService } from './../utils/config.service';

import { Subscription }   from 'rxjs/Subscription';

import { User } from "./user";

@Component({
  templateUrl: 'app/login/login.component.html',
  styleUrls: ['dist/login/login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  private user: User;
  private payLoad: any;
  private theme: string;
  private subscription: Subscription;
  private sid:string;
  private isLoading:boolean = false;

  constructor(private loginService: LoginService, private router: Router, private collectionService: CollectionService, private coreService: CoreService, private configService: ConfigService) {
    this.user = new User();

    this.subscription = this.configService.mode$.subscribe(
      data => {
        this.theme = data;
      }
    )
    this.theme = configService.mode;
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  onSubmit() {
    this.payLoad = JSON.stringify(this.user);
    this.loginService.doLogin(this.user).subscribe(
      data => {
        if (data.success) {
          localStorage.setItem('jwt', this.loginService.encode(this.payLoad)); // save creds in storage
          this.getCollection();
        }
      },
      error => {
        console.error('session failed; bah');
      }
    )
  }

  getCollection() {
    this.isLoading = true;
    this.collectionService.getCollection()
      .subscribe(
      data => this.fillCollection(data),
      error => console.log(error)
      );
  }
  fillCollection(data: any): void {
    this.coreService.getCore().parseSourceJson(data);
    this.router.navigate(['/home']);
  }

};