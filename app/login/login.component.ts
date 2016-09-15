import { Component, OnInit, Input ,OnDestroy, NgModule } from "@angular/core";
import { FormGroup, ReactiveFormsModule, FormControl, Validators, FormBuilder} from '@angular/forms';
import { LoginService } from './login.service';
import { Router } from "@angular/router";
import { CollectionService } from './../collection.service';
import { TooltipModule } from 'ng2-bootstrap/ng2-bootstrap';
import { CoreService } from './../core.service';
import { ConfigService } from './../utils/config.service';

import { Subscription }   from 'rxjs/Subscription';

@NgModule({
  imports: [ ReactiveFormsModule, TooltipModule]
})
@Component({
  templateUrl: 'app/login/login.component.html',
  styleUrls: [ 'dist/login/login.component.css'],
  providers: [ LoginService ]
})
export class LoginComponent implements OnInit, OnDestroy {
  @Input() username:string;
  @Input() password:string;
  @Input() dsmport:string = localStorage.getItem('dsm') || document.location.origin;
  private form: FormGroup;
  private payLoad:any;
  private theme:string;
  private subscription:Subscription;
  private sid;

  constructor(private loginService:LoginService, private router:Router, private collectionService: CollectionService, private coreService:CoreService, private configService: ConfigService, private fb: FormBuilder) {
    this.form = this.fb.group({
      'name': [this.username, Validators.required],
      'password': [this.password, Validators.required],
      'dsmport': [this.dsmport, Validators.required]
    });
    this.form.valueChanges.subscribe(
      data => console.log(data)
    );
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