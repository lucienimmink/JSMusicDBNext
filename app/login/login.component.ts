import { Component, OnInit, Input ,OnDestroy } from "@angular/core";
import { FormGroup, REACTIVE_FORM_DIRECTIVES, FormControl, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { Router } from "@angular/router-deprecated";
import { CollectionService } from './../collection.service';
import { TOOLTIP_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';
import { CoreService } from './../core.service';
import { ConfigService } from './../utils/config.service';

import { Subscription }   from 'rxjs/Subscription';

@Component({
  templateUrl: 'app/login/login.component.html',
  styleUrls: [ 'dist/login/login.component.css'],
  directives: [ REACTIVE_FORM_DIRECTIVES, TOOLTIP_DIRECTIVES ],
  providers: [ LoginService ]
})
export class LoginComponent implements OnInit, OnDestroy {
  @Input() username:string;
  @Input() password:string;
  @Input() lastfmname:string;
  @Input() dsmport:string;
  private form: FormGroup;
  private payLoad:any;
  private theme:string;
  private subscription:Subscription;
  private sid;

  constructor(private loginService:LoginService, private router:Router, private collectionService: CollectionService, private coreService:CoreService, private configService: ConfigService) {
    let controls:any = {};
    controls['name'] = new FormControl('', Validators.required);
    controls['password'] = new FormControl('', Validators.required);
    controls['dsmport'] = new FormControl(localStorage.getItem('dsm') || document.location.origin, Validators.required);
    this.form = new FormGroup(controls);

    this.subscription = this.configService.theme$.subscribe(
        data => {
            this.theme = data;
        }
    )
    this.theme = configService.theme;

  }

  ngOnInit() {

  }

  ngOnDestroy() {
      this.subscription.unsubscribe();
  }
  onSubmit() {
    this.payLoad = JSON.stringify(this.form.value);
    this.loginService.doLogin(this.form.value).subscribe(
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
    this.collectionService.getCollection()
      .subscribe(
      data => this.fillCollection(data),
      error => console.log(error)
      );
  }
  fillCollection(data: any): void {
    this.coreService.getCore().parseSourceJson(data);
    this.router.navigate(['Home']);
  }

};