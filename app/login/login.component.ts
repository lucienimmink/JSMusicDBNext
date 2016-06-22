import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, REACTIVE_FORM_DIRECTIVES, FormControl, Validators } from '@angular/forms';
import { LoginService } from './login.service';

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

  constructor(private loginService:LoginService) {
    let controls:any = {};
    controls['name'] = new FormControl('', Validators.required);
    controls['password'] = new FormControl('', Validators.required);
    controls['dsmport'] = new FormControl('', Validators.required);
    controls['rememberme'] = new FormControl('');
    controls['lastfmname'] = new FormControl('');
    this.form = new FormGroup(controls);
  }

  ngOnInit() {

  }
  onSubmit() {
    this.payLoad = JSON.stringify(this.form.value);
    if (this.form.value.rememberme) {
      localStorage.setItem('jwt', this.payLoad);
    }
    this.loginService.doLogin(this.form.value).subscribe(
      data => {
        this.sid = data.data.sid;
        document.cookie = `id=${this.sid}; path=/`;
        console.log('session OK; session id set to ', this.sid);
      },
      error => {
        console.error('session failed; bah');
      }
    )
  }

};