import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  public form: FormGroup;
  public errorMessage = '';
  public rememberMe = false;

  constructor(private fb: FormBuilder, private router: Router , private authService: AuthService , private localStorage: LocalStorageService , private sessionStorage: SessionStorageService) {}

  ngOnInit() {
    this.form = this.fb.group ( {
      uname: [null , Validators.compose ( [ Validators.required ] )] , password: [null , Validators.compose ( [ Validators.required ] )]
    } );
  }

  onSubmit() {

    this.authService
        .login( this.form.value.uname , this.form.value.password )
        .subscribe(
        (user) => {

          if( this.rememberMe ){
            this.localStorage.store( 'token' , user.token );
          }
          else{
            this.sessionStorage.store( 'token' , user.token );
          }

          this.router.navigate ( [ '/' ] );
        },
        (error) => {

          if( error.message == 'invalidLogin' ){
            this.errorMessage = 'Invalid email or password. Try Again';
          }
          else{
            this.errorMessage = 'Unknown Error. Please try again later';
          }
        });
  }

}
