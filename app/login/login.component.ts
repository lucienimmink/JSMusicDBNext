import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, REACTIVE_FORM_DIRECTIVES, FormControl, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { Router } from "@angular/router-deprecated";

@Component({
  templateUrl: 'app/login/login.component.html',
  styleUrls: [ 'dist/login/login.component.css'],
  directives: [ REACTIVE_FORM_DIRECTIVES ],
  providers: [ LoginService ]
})
export class LoginComponent implements OnInit {
  @Input() username:string;
  @Input() password:string;
  @Input() lastfmname:string;
  @Input() dsmport:string;
  private form: FormGroup;
  private payLoad:any;
  private sid;

  constructor(private loginService:LoginService, private router:Router) {
    let controls:any = {};
    controls['name'] = new FormControl('', Validators.required);
    controls['password'] = new FormControl('', Validators.required);
    controls['dsmport'] = new FormControl('', Validators.required);
    controls['lastfmname'] = new FormControl('');
    this.form = new FormGroup(controls);
  }

  ngOnInit() {

  }
  onSubmit() {
    this.payLoad = JSON.stringify(this.form.value);
    this.loginService.doLogin(this.form.value).subscribe(
      data => {
        if (data.success) {
          localStorage.setItem('jwt', this.payLoad); // save creds in storage
          sessionStorage.setItem('jwt', 'true'); // set loggedin state
          this.router.navigate(['Home']);
        }
      },
      error => {
        console.error('session failed; bah');
      }
    )
  }

};