import { Component, OnInit, Input } from "@angular/core";

@Component({
  templateUrl: 'app/login/login.component.html',
  styleUrls: [ 'dist/login/login.component.css']
})
export class LoginComponent implements OnInit {
  @Input() username:string;
  @Input() password:string;
  @Input() lastfmname:string;
  @Input() dsmport:string;
  constructor() {}

  ngOnInit() {

  }

};